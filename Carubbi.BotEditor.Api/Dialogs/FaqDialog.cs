using Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Faq;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Services.Faq;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class FaqDialog : BaseDialog<object, FaqStep>
    {

        public FaqDialog(BotConfig botConfig, CompositeStep parentStep, FaqStep step)
            : base(botConfig, parentStep, step)
        {
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            var message = await CreateActivityWithMessage(context, _step.AskQuestionMessage, Constants.DEFAULT_FAQ_ASK_MESSAGE);
            await context.PostAsync(message); 
            context.Wait(ResumeAfterQuestionAsync);
        }

        private async Task ResumeAfterQuestionAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var faqService = Conversation.Container.ResolveKeyed<IFaqService>(
                _step.FaqSettings.ServiceType,
                new TypedParameter(typeof(Settings), _step.FaqSettings)
            );

            var question = (await result).Text;
            var response = await faqService.QueryAsync(question);

            var validResponses = response.Answers
                .Where(a => a.Score >= _step.MinimumScore);

            _step.Output = validResponses.ToList();
            PersistOutput(context, _step.Output);

            if (_step.NextStepId.HasValue)
            {
                var nextStep = GetStep(_step.NextStepId.Value);
                var dialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                context.Call(dialog, GoBack);
            }
            else
            {
                context.Done<object>(null);
            }
        }

       
    }
}