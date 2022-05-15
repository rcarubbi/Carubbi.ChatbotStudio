using Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Extensions;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Services.SpeechSysthesizer;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public abstract class BaseDialog<T, TStep> : IDialog<T> where TStep : Step
    {
        protected readonly CompositeStep _parentStep;
        protected BotConfig _botConfig;

        [NonSerialized]
        protected ExpressionEvaluator _expressionEvaluator;

        protected readonly TStep _step;
        protected List<object> DataSource { get; set; }

        public BaseDialog(BotConfig botConfig, CompositeStep parentStep, TStep step)
        {
            _parentStep = parentStep;
            _botConfig = botConfig;
            _step = step;
            CreateExpressionEvaluator();
        }

        private void CreateExpressionEvaluator()
        {
            _expressionEvaluator = new ExpressionEvaluator(_botConfig, _parentStep, null);
            if (_step != null) DataSource = _expressionEvaluator.ResolveDataSource(_step.DataSourceExpression);
        }

        protected async Task<IMessageActivity> CreateActivityWithMessage(IDialogContext context, MessageInteractions message, string defaultMessage)
        {
            if (_expressionEvaluator == null) CreateExpressionEvaluator();

            _expressionEvaluator.Activity = context.Activity;

            var spokenInteraction = IsOutputSpoken(context);

            var messages = message?.GetMessages(spokenInteraction);
            var selectedMessage = messages?.Count > 0
                ? messages.GetRandom()
                : defaultMessage;

            var messageText = _expressionEvaluator.PrepareMessage(_step.Id, selectedMessage);

            var messageActivity = context.MakeMessage();

            if (spokenInteraction)
            {
                var speechSysthesizerManager = Conversation.Container.Resolve<SpeechSynthesizerManager>();
                var url = await speechSysthesizerManager.GetUrlAsync(context.Activity.From.Id, messageText);
                messageActivity.MakeAudioCard(url);
            }
            else
            {
                messageActivity.Text = messageText;
            }

            if (message?.Files?.Count() > 0)
            {
                var attachedFile = message.Files.GetRandom();
                if (attachedFile.IsImage())
                {
                    var imageHeroCard = new HeroCard
                    {
                        Text = messageText,
                        Images = new List<CardImage>
                        {
                            new CardImage
                            {
                                Url = _expressionEvaluator.PrepareMessage(_step.Id, attachedFile.Url),
                                Alt = _expressionEvaluator.PrepareMessage(_step.Id, attachedFile.Filename),
                            }
                        }
                    };
                    messageActivity.Text = string.Empty;
                    messageActivity.Attachments.Add(imageHeroCard.ToAttachment());
                }
                else
                {
                    messageActivity.Attachments.Add(new Attachment
                    {
                        ContentUrl = _expressionEvaluator.PrepareMessage(_step.Id, attachedFile.Url),
                        Name = _expressionEvaluator.PrepareMessage(_step.Id, attachedFile.Filename),
                    });
                }
            }

            return messageActivity;
        }



        protected void PersistOutput<TOutput>(IDialogContext context, TOutput output)
        {
            if (_step.IsOutput() && (_step as IOutput<object>).Durable)
            {
                if (context.UserData.ContainsKey(_step.Id.ToString()))
                {
                    context.UserData.RemoveValue(_step.Id.ToString());
                }
                context.UserData.SetValue(_step.Id.ToString(), output);
            }
        }

        public async Task StartAsync(IDialogContext context)
        {
            if (_expressionEvaluator != null) _expressionEvaluator.Activity = context.Activity;
            await CheckBotIntegrity(context,
                async (ctx) => await PerformStartAsync(ctx));
        }

        private async Task CheckBotIntegrity(IDialogContext context, Func<IDialogContext, Task> startDialogTask)
        {
            var liveBotConfig = Conversation.Container.Resolve<BotConfig>();
            if (_botConfig.UpdatedAt < liveBotConfig.UpdatedAt)
            {
                _botConfig = liveBotConfig;
                await context.PostAsync(_botConfig.UpdateVersionMessage ?? "Fui atualizado desde nossa última conversa, por favor mande outra mensagem para recomeçar...");
                context.EndConversation(EndOfConversationCodes.CompletedSuccessfully);
            }
            else
            {
                await startDialogTask(context);
            }
        }

        protected async Task GoBack(IDialogContext context, IAwaitable<T> result)
        {
            await result;
            context.Done(default(T));
        }

        protected List<Step> Steps
        {
            get
            {
                return (_parentStep ?? (IStepsContainer)_botConfig).Steps;
            }
        }

        protected Step GetStep(int id)
        {
            try
            {
                return Steps.Single(x => x.Id == id);
            }
            catch (InvalidOperationException)
            {
                throw new ArgumentException(string.Format(Constants.COULD_NOT_LOAD_STEP_MESSAGE, id));
            }
        }


        protected bool IsOutputSpoken(IDialogContext context)
        {
            return HasSysthesisService() && LastInteractionWasSpoken(context);
        }

        private bool HasSysthesisService()
        {
            return _botConfig.SpeechSettings?.Synthesis != null;
        }

        protected bool LastInteractionWasSpoken(IDialogContext context)
        {
            return context.Activity.AsMessageActivity().HasAudioAttachment();
        }


        protected abstract Task PerformStartAsync(IDialogContext context);
    }
}