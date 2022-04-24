using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class ReadGPSLocationDialog : BaseDialog<object, ReadGPSLocationStep>
    {
        private int _maxAttempts;
        private int _retries;

        public ReadGPSLocationDialog(BotConfig botConfig, CompositeStep compositeStep, ReadGPSLocationStep step)
            : base(botConfig, compositeStep, step)
        {
            _maxAttempts = _step.Attempts ?? 2;
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            _retries = 0;
            var message = await CreateActivityWithMessage(context, _step.AskLocationMessage, Constants.DEFAULT_READ_GPS_MESSAGE);
            await context.PostAsync(message);
            context.Wait(ResumeAfterShareLocation);
        }

        private async Task ResumeAfterShareLocation(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var activity = await result;
            if (activity.Entities.Count > 0)
            {
                _step.Output = new ReadGPSLocationResult
                {
                    Latitude = activity.Entities[0].Properties.Root["geo"]["latitude"].ToString(),
                    Longitude = activity.Entities[0].Properties.Root["geo"]["longitude"].ToString()
                };
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
            else
            {
                _retries++;
                if (_maxAttempts >= _retries)
                {
                    var errorMessage = await CreateActivityWithMessage(context, _step.RetryMessage, Constants.DEFAULT_READ_GPS_RETRY_MESSAGE);
                    await context.PostAsync(errorMessage);
                    context.Wait(ResumeAfterShareLocation);
                }
                else
                {
                    var errorMessage = await CreateActivityWithMessage(context, _step.TooManyAttemptsMessage, Constants.DEFAULT_TOO_MANY_ATTEMPTS_MESSAGE);
                    await context.PostAsync(errorMessage);

                    if (_step.ErrorStepId.HasValue)
                    {
                        var nextStep = GetStep(_step.ErrorStepId.Value);
                        var dialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                        context.Call(dialog, GoBack);
                    }
                    else
                        context.Done<object>(null);
                }
            }
        }
    }
}