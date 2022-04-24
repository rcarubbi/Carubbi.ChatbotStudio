using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.Dialogs;
using System;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class MessageDialog : BaseDialog<object, MessageStep>
    {
        public MessageDialog(BotConfig botConfig, CompositeStep parentStep, MessageStep step)
            : base(botConfig, parentStep, step)
        {
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            var message = await CreateActivityWithMessage(context, _step.Messages, string.Format(Constants.DEFAULT_MESSAGE, _step.Id));
            await context.PostAsync(message);

            if (_step.NextStepId.HasValue)
            {
                var nextStep = GetStep(_step.NextStepId.Value);
                var dialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                if (dialog != null)
                {
                    context.Call(dialog, GoBack);
                }
                else
                {
                    context.Done<object>(null);
                }
            }
            else
                context.Done<object>(null);
        }
    }
}