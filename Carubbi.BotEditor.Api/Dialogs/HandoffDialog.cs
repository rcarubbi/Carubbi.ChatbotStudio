using Autofac;
using Carubbi.BotEditor.Api.Extensions;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class HandoffDialog : BaseDialog<object, HandoffStep>
    {
        public HandoffDialog(BotConfig botConfig, CompositeStep compositeStep, HandoffStep step)
            : base(botConfig, compositeStep, step)
        {
            _step.Output = string.Empty;
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            var message = context.Activity.AsMessageActivity();
            message.Type = "ConversationStarted";
            var serializedBotConfig = JsonConvert.SerializeObject(_botConfig.Clone());
            JObject botConfigJObject = JsonConvert.DeserializeObject<JObject>(serializedBotConfig);
            botConfigJObject.StripFormStepsOutputTypes();
            message.ChannelData = botConfigJObject.ToString();

            using (var scope = Conversation.Container.BeginLifetimeScope())
            {
                var store = scope.Resolve<IBotDataStore<BotData>>();
                var reply = (context.Activity as Activity).CreateReply();
                await reply.UpdateConversationDataAsync(store, "disconnect", false);
            }

            using (var client = new HttpClient())
            {
                await client.PostAsJsonAsync(_step.Endpoint, message);
            }
 
            context.Wait(MessageReceivedAsync);
            
        }

       

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;
            var serializedBotConfig = JsonConvert.SerializeObject(_botConfig.Clone());
            JObject botConfigJObject = JsonConvert.DeserializeObject<JObject>(serializedBotConfig);
            botConfigJObject.StripFormStepsOutputTypes();
            message.ChannelData = botConfigJObject.ToString();

            using (var client = new HttpClient())
            {
                await client.PostAsJsonAsync(_step.Endpoint, message);
            }

            bool disconnect = false;
            using (var scope = Conversation.Container.BeginLifetimeScope())
            {
                var store = scope.Resolve<IBotDataStore<BotData>>();
                var reply = (context.Activity as Activity).CreateReply();
                disconnect = await reply.ReadConversationDataAsync<bool>(store, "disconnect");
            }

            if (!disconnect)
            {
                context.Wait(MessageReceivedAsync);
            }
            else
            {
              
                using (var scope = Conversation.Container.BeginLifetimeScope())
                {
                    var store = scope.Resolve<IBotDataStore<BotData>>();
                    var reply = (context.Activity as Activity).CreateReply();
                    disconnect = await reply.ReadConversationDataAsync<bool>(store, "disconnect");
                    var outputString = await reply.ReadConversationDataAsync<string>(store, "handoffOutput"); 
                    try
                    {
                        _step.Output = JsonConvert.DeserializeObject(outputString);
                    }
                    catch
                    {
                        _step.Output = outputString;
                    }


                }

                PersistOutput(context, _step.Output);

                if (_step.NextStepId.HasValue)
                {
                    var nextStep = GetStep(_step.NextStepId.Value);
                    var dialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                    context.Call(dialog, GoBack);
                }
                else
                    context.Done<object>(null);
            }
        }
    }
}