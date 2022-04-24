using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class ConfirmDialog : BaseDialog<object, ConfirmStep>
    {
        private int retries;

        public ConfirmDialog(BotConfig botConfig, CompositeStep parentStep, ConfirmStep step)
          : base(botConfig, parentStep, step)
        {
            retries = 0;
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            await AskQuestion(context);
        }

        private async Task AskQuestion(IDialogContext context)
        {
            var spokenInteraction = IsOutputSpoken(context);

            var messageActivity = retries > 0
                ? (await CreateActivityWithMessage(context, _step.RetryMessage, Constants.DEFAULT_RETRY_MESSAGE))
                : (await CreateActivityWithMessage(context, _step.Question, string.Format(Constants.DEFAULT_QUESTION_MESSAGE, _step.Id)));

            messageActivity.AttachmentLayout = AttachmentLayoutTypes.List;
            messageActivity.Attachments.Add(new HeroCard(
                  buttons: new List<CardAction> {
                            new CardAction() { Title = _step.YesText ?? Constants.DEFAULT_YES, Type = ActionTypes.ImBack, Value = _step.YesText ?? Constants.DEFAULT_YES },
                            new CardAction() { Title =_step.NoText ?? Constants.DEFAULT_NO, Type = ActionTypes.ImBack, Value = _step.NoText ?? Constants.DEFAULT_NO },
                  }).ToAttachment());

            await context.PostAsync(messageActivity);
            context.Wait(ConfirmResumeAfter);
        }



        private async Task ConfirmResumeAfter(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;
            bool? answer = null;
            var yesText = _step.YesAcceptedAnswers?.Length > 0 ? _step.YesAcceptedAnswers : new string[] { _step.YesText ?? Constants.DEFAULT_YES};
            var noText = _step.NoAcceptedAnswers?.Length > 0 ? _step.NoAcceptedAnswers : new string[] { _step.NoText ?? Constants.DEFAULT_NO };

            if (int.TryParse(message.Text, out var numericAnswer))
            {
                answer = numericAnswer == 1 ? true : numericAnswer == 2 ? false : (bool?)null;
            }
            else
            {
                answer = yesText.Any(x => x.Equals(message.Text, StringComparison.CurrentCultureIgnoreCase))
                   ? true
                   : noText.Any(x => x.Equals(message.Text, StringComparison.CurrentCultureIgnoreCase))
                       ? false
                       : (bool?)null;
            }

            if (!answer.HasValue)
            {
                retries++;
                if (retries > (_step.Attempts ?? 2))
                {
                    var messageActivity = await CreateActivityWithMessage(context, _step.TooManyAttemptsMessage, Constants.DEFAULT_TOO_MANY_ATTEMPTS_MESSAGE);
                    await context.PostAsync(messageActivity);
                    context.Done<object>(null);
                }
                else
                {
                    await AskQuestion(context);
                }
            }
            else
            {
                var stepId = answer.Value
                    ? _step.TrueStepId == 0 ? _step.NextStepId : _step.TrueStepId
                    : _step.FalseStepId == 0 ? _step.NextStepId : _step.FalseStepId;

                _step.Output = new ConfirmResult { Answer = answer };
                PersistOutput(context, _step.Output);

                if (stepId.HasValue)
                {
                    var step = GetStep(stepId.Value);
                    var dialog = step.MakeDialog(_botConfig, context.Activity, _parentStep);
                    context.Call(dialog, GoBack);
                }
                else
                    context.Done<object>(null);
            }
        }

       
    }
}