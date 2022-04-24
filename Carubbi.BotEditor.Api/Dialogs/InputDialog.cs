using Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.NLP;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Config.TextAnalysis;
using Carubbi.BotEditor.Services.Nlp;
using Carubbi.BotEditor.Services.TextAnalysis;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class InputDialog : BaseDialog<object, InputStep>
    {
        public InputDialog(BotConfig botConfig, CompositeStep parentStep, InputStep step)
            : base(botConfig, parentStep, step)
        {
            _step.Output = new InputResult();
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            var questionMessage = await CreateActivityWithMessage(context, _step.Question, string.Format(Constants.DEFAULT_QUESTION_MESSAGE, _step.Id));
            await context.PostAsync(questionMessage);
            context.Wait(AnswerReceivedAsync);
        }

        private async Task AnswerReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var answer = await result;
            INLPService nlpService = null;
            ITextAnalysisService textAnalysisService = null;

            if (_step.TextAnalysisSettings != null)
            {
                textAnalysisService = Conversation.Container
                  .ResolveKeyed<ITextAnalysisService>(_step.TextAnalysisSettings.ServiceType,
                  new TypedParameter(typeof(TextAnalysisSettings), _step.TextAnalysisSettings));
            }

            if (_step.NLPSettings != null)
            {
                nlpService = Conversation.Container
                    .ResolveKeyed<INLPService>(_step.NLPSettings.ServiceType,
                    new TypedParameter(typeof(Settings), _step.NLPSettings));
            }

            try
            {
                _step.Output.SentimentScore = (textAnalysisService != null)
                        ? (await textAnalysisService.GetSentimentAsync(answer.Text))
                        : (double?)null;

                _step.Output.NLPResult = (nlpService != null)
                        ? await nlpService.GetTopScoringResultAsync(answer.Text)
                        : null;

                _step.Output.Answer = answer.Text;
                PersistOutput(context, _step.Output);

                if (_step.NextStepId.HasValue)
                {
                    var nextStep = GetStep(_step.NextStepId.Value);
                    var dialog = nextStep.MakeDialog(_botConfig, context.Activity,_parentStep);
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
                {
                    context.Done<object>(null);
                }
            }
            catch (Exception ex)
            {
                await context.PostAsync(ex.Message);
            }
        }
    }
}