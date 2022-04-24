using Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.ImageClassification;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Services.ImageClassification;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class ImageClassificationDialog : BaseDialog<object, ImageClassificationStep>
    {
        private int _retries;
        private int _attempts;
        public ImageClassificationDialog(BotConfig botConfig, CompositeStep parentStep, ImageClassificationStep step)
            : base(botConfig, parentStep, step)
        {
            _attempts = _step.Attempts ?? 2;
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            _retries = 0;
            var message = await CreateActivityWithMessage(context, _step.AskImageMessage, Constants.DEFAULT_IMAGE_CLASSIFICATION_ASK_IMAGE_MESSAGE);
            context.Wait(ResumeAfterImageSent);
        }

        private async Task ResumeAfterImageSent(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;
            try
            {
                var imageClassificationService = Conversation.Container.ResolveKeyed<IImageClassificationService>(
                    _step.ImageClassificationSettings.ServiceType,
                    new TypedParameter(typeof(Settings), _step.ImageClassificationSettings));

                await imageClassificationService.LoadIteration();

                var attachment = message.Attachments.FirstOrDefault();
                var imageUrl = attachment?.ContentUrl;

                if (!string.IsNullOrWhiteSpace(imageUrl))
                {
                    var tags = await imageClassificationService.ClassifyAsync(imageUrl);
                    _step.Output = FilterResults(tags).ToList();
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
                    if (_retries < _attempts)
                    {
                        var errorMessage = await CreateActivityWithMessage(context, _step.RetryMessage, Constants.DEFAULT_IMAGE_CLASSIFICATION_RETRY_MESSAGE);
                        await context.PostAsync(errorMessage);
                        context.Wait(ResumeAfterImageSent);
                    }
                    else
                    {
                        var errorMessage = await CreateActivityWithMessage(context, _step.TooManyAttemptsMessage, Constants.DEFAULT_TOO_MANY_ATTEMPTS_MESSAGE);
                        await context.PostAsync(errorMessage);

                        if (_step.ErrorStepId.HasValue)
                        {
                            var nextStep = GetStep(_step.ErrorStepId.Value);
                            var dialog = nextStep.MakeDialog(_botConfig, context.Activity,_parentStep);
                            context.Call(dialog, GoBack);
                        }
                        else
                            context.Done<object>(null);
                    }
                }
            }
            catch (ArgumentException ex)
            {
                await context.PostAsync(ex.Message);
                context.Done<object>(null);
            }
        }

        private IEnumerable<ClassificationResult> FilterResults(List<ClassificationResult> predictions)
        {
            return predictions
                 .Where(p => p.Score > _step.MinScore)
                 .OrderByDescending(x => x.Score)
                 .Take(_step.MaxResults);
        }
    }
}