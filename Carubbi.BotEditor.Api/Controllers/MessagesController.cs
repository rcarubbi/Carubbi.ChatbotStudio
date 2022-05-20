using Autofac;
using Carubbi.BotEditor.Api.BotOverrides.Autofac;
using Carubbi.BotEditor.Api.Extensions;
using Carubbi.BotEditor.Api.Forms;
using Carubbi.BotEditor.Api.Models;
using Carubbi.BotEditor.Api.State;
using Carubbi.BotEditor.Backend.Domain;
using Carubbi.BotEditor.Backend.Domain.Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Extensions;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Services.Autofac;
using Carubbi.BotEditor.Services.SpeechRecognition;
using Microsoft.Bot.Builder.Azure;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;
using System;
using System.Configuration;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Carubbi.BotEditor.Api
{
    [BotAuthentication(CredentialProviderType = typeof(BotConfigBasedCredentialProvider))]
    public class MessagesController : ApiController
    {
        private readonly ILifetimeScope _scope;
        private readonly BotConfigService _botConfigService;
        private readonly BotInstanceSettings _settings;
        private readonly MicrosoftAppCredentials _microsoftAppCredentials;
        private readonly IBotDataStore<BotData> _botDataStore;
        private readonly BotConfig _botConfig;
        public MessagesController(ILifetimeScope scope,
            BotConfigService botConfigService,
            BotInstanceSettings settings,
            MicrosoftAppCredentials microsoftAppCredentials,
            IBotDataStore<BotData> botDataStore)
        {
            _scope = scope;
            _botConfigService = botConfigService;
            _settings = settings;
            _microsoftAppCredentials = microsoftAppCredentials;
            _botDataStore = botDataStore;
            _botConfig = _botConfigService.GetConfig(_settings.BotId, Convert.ToBoolean(ConfigurationManager.AppSettings["Published"]));

            Conversation.UpdateContainer(builder =>
            {
                builder.RegisterModule(new BotConfigModule());
                builder.Register(ctx => botConfigService).AsSelf();
                builder.Register(ctx => _botConfig).AsSelf();
                builder.RegisterModule(new DefaultExceptionMessageOverrideModule());
                builder.RegisterModule(new ServicesModule());
                builder.RegisterModule(new AzureModule(Assembly.GetExecutingAssembly()));
                builder.RegisterModule(new BotDataStoreModule(settings));
                builder.Register(ctx => settings).AsSelf();
                builder.RegisterInstance(HttpContext.Current).AsSelf();
            });
        }

        /// <summary>
        /// POST: api/Messages
        /// Receive a message from a user and reply to it
        /// </summary>
        public async Task<HttpResponseMessage> Post([FromBody]Activity activity, string botId)
        {
            if (activity.Type == ActivityTypes.Message)
            {
                await HandleMessageActivityAsync(activity);
            }
            else if (activity.Type == ActivityTypes.Handoff)
            {
                await HandleHandoffMessage(activity);
            }
            else if (activity.Type == "EndHandoff")
            {
                await HandleEndHandoffMessage(activity);
            }
            else
            {
                HandleSystemMessage(activity);
            }
            var response = Request.CreateResponse(HttpStatusCode.OK);
            return response;
        }

        private async Task HandleHandoffMessage(Activity activity)
        {
            var connector = _microsoftAppCredentials.MicrosoftAppId == null
                    ? new ConnectorClient(new Uri(activity.ServiceUrl))
                    : new ConnectorClient(new Uri(activity.ServiceUrl), _microsoftAppCredentials);
            activity.Type = ActivityTypes.Message;
            await connector.Conversations.SendToConversationAsync(activity);
        }

        private async Task HandleEndHandoffMessage(Activity activity)
        {
            var connector = _microsoftAppCredentials.MicrosoftAppId == null
                  ? new ConnectorClient(new Uri(activity.ServiceUrl))
                  : new ConnectorClient(new Uri(activity.ServiceUrl), _microsoftAppCredentials);
            activity.Type = ActivityTypes.Message;

            using (var scope = Conversation.Container.BeginLifetimeScope())
            {
                var store = scope.Resolve<IBotDataStore<BotData>>();
                await activity.UpdateConversationDataAsync(store, "disconnect", true);
                await activity.UpdateConversationDataAsync(store, "handoffOutput", activity.ChannelData);
            }

            await connector.Conversations.SendToConversationAsync(activity);
            var reply = activity.CreateReply("redirect");
            using (var client = new HttpClient())
            {
                // TODO: Tratar autenticação
                //_botConfig.AppId
                //_botConfig.AppPassword
                
                var response = await client.PostAsJsonAsync($"{Request.GetRequestContext().VirtualPathRoot}/bot/{_botConfig.Name}", reply);
            }
        }

        private async Task<BotConfig> LoadDurableOutputsAsync(IMessageActivity message)
        {
            var key = new AddressKey()
            {
                BotId = message.Recipient.Id,
                ChannelId = message.ChannelId,
                UserId = message.From.Id,
                ConversationId = message.Conversation.Id,
                ServiceUrl = message.ServiceUrl
            };

            var userData = await _botDataStore.LoadAsync(key, BotStoreType.BotUserData, CancellationToken.None);

            var updatedBotConfig = (BotConfig)_botConfig.Clone();
            foreach (var step in _botConfig.Steps)
            {
                if (step.IsOutput())
                {
                    var outputStep = step as IOutput<object>;
                    if (outputStep.Durable)
                    {

                        var data = userData.GetProperty<object>(step.Id.ToString());
                        if (data != null)
                        {
                            var stepToSet = updatedBotConfig.Steps.Single(x => x.Id == step.Id);
                            if (data is JObject)
                            {
                                if ((data as JObject).ContainsFormStepType())
                                {
                                    SetFormResult(data, stepToSet);
                                } 
                                else
                                {
                                    stepToSet.GetType().GetProperty(Constants.OUTPUT_PROPERTY_NAME).SetValue(stepToSet, data, null);
                                }
                            }
                            else
                            {
                                stepToSet.GetType().GetProperty(Constants.OUTPUT_PROPERTY_NAME).SetValue(stepToSet, data, null);
                            }
                        }
                    }
                }
            }

            return updatedBotConfig;
        }

        private static void SetFormResult(object data, Step stepToSet)
        {
            (data as JObject).StripFormStepTypes();
          
            var form = (data as JObject)["form"] as JObject;

            var formData = new JObject();
            foreach (JProperty item in form.Properties())
            {
                formData.Add(item.Name.Capitalize(), item.Value);
            }

            var formResult = (data as JObject).ToObject<FormResult>();
            formResult.Form = formData;
            stepToSet.GetType().GetProperty(Constants.OUTPUT_PROPERTY_NAME).SetValue(stepToSet, formResult, null);
        }

        private async Task HandleMessageActivityAsync(Activity activity)
        {
            if (activity.Recipient == null)
            {
                activity.Recipient = new ChannelAccount { Id = _botConfig.Name, Name = _botConfig.Name };
            }

            using (new FormStepAssemblyResolver())
            {
                var connector = _microsoftAppCredentials.MicrosoftAppId == null
                    ? new ConnectorClient(new Uri(activity.ServiceUrl))
                    : new ConnectorClient(new Uri(activity.ServiceUrl), _microsoftAppCredentials);

                await activity.HandleTypingAsync(connector);

                if (!await HandleCustomCommandsAsync(activity, connector))
                {
                    var mainTask = Task.Factory.StartNew(async () =>
                    {
                            if (activity.HasAudioAttachment() && _botConfig.SpeechSettings?.Recognition != null)
                        {
                            var speechRecognitionService = _scope.ResolveKeyed<ISpeechRecognitionService>(_botConfig.SpeechSettings?.Recognition?.ServiceType,
                                   new TypedParameter(typeof(SpeechRecognitionSettings), _botConfig.SpeechSettings?.Recognition),
                                   new TypedParameter(typeof(HttpContext), HttpContext.Current));

                            activity.Text = await speechRecognitionService.RecognizeAsync(new Uri(activity.Attachments[0].ContentUrl));
                        }

                        var filledBotConfig = await LoadDurableOutputsAsync(activity.AsMessageActivity());

                        await Conversation.SendAsync(activity, () => new Dialogs.RootDialog(_scope, filledBotConfig));
                    });

                    if (Debugger.IsAttached)
                    {
                        await mainTask.Result;
                    }
                    else
                    {
                        // Estratégia para suprimir mensagem de timeout que o connector envia para os canais
                        // Sempre envia Response Status 200 - OK em no máximo 14 segundos evitando assim o timeout
                        var timeout = 14000;
                        await Task.WhenAny(mainTask, Task.Delay(timeout));
                    }
                }
            }
        }


        public async Task<bool> HandleCustomCommandsAsync(Activity activity, ConnectorClient connector)
        {
            var command = _botConfig.CustomCommands?.FirstOrDefault(x => x.CommandText.Equals(activity.Text, StringComparison.CurrentCultureIgnoreCase));
            if (command == null)
            {
                return false;
            }

            using (var scope = DialogModule.BeginLifetimeScope(Conversation.Container, activity))
            {
                if (command.Startup)
                {
                    await StateManager.ClearDialogStack(scope);
                    return false;
                }

                if (command.ClearDialogStack)
                {
                    await StateManager.ClearDialogStack(scope);
                }

                if (command.DeleteProfile)
                {
                    await StateManager.DeleteProfile(scope);
                }

                if (command.InvalidateCache)
                {
                    _botConfigService.InvalidateCache(_botConfig.Name);
                }

                if (!string.IsNullOrWhiteSpace(command.CustomMessageReply))
                {
                    var reply = activity.CreateReply(command.CustomMessageReply);
                    await connector.Conversations.ReplyToActivityAsync(reply);
                }
            }
            return true;
        }

        private Activity HandleSystemMessage(Activity message)
        {
            if (message.Type == ActivityTypes.DeleteUserData)
            {
                // Implement user deletion here
                // If we handle user deletion, return a real message
            }
            else if (message.Type == ActivityTypes.ConversationUpdate)
            {
                // Handle conversation state changes, like members being added and removed
                // Use Activity.MembersAdded and Activity.MembersRemoved and Activity.Action for info
                // Not available in all channels
            }
            else if (message.Type == ActivityTypes.ContactRelationUpdate)
            {
                // Handle add/remove from contact lists
                // Activity.From + Activity.Action represent what happened
            }
            else if (message.Type == ActivityTypes.Typing)
            {
                // Handle knowing tha the user is typing
            }

            return null;
        }
    }
}