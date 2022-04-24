using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.Dialogs;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class CompositeDialog : BaseDialog<object, CompositeStep>
    {
        public CompositeDialog(BotConfig botConfig, CompositeStep parentStep, CompositeStep step)
            : base(botConfig, parentStep, step)
        {
           
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            Step rootStep = null;

            try
            {
                rootStep = _step.Steps.Single(s => s.Id == _step.RootStepId); 
            }
            catch(ArgumentException ex)
            {
                await context.PostAsync(ex.Message);
            }

            if (rootStep != null)
            {
                var dialog = rootStep.MakeDialog(_botConfig, context.Activity, _step);
                context.Call(dialog, ResumeAfter);
            }
        }

        private async Task ResumeAfter(IDialogContext context, IAwaitable<object> result)
        {
            await result;
            Step nextStep = null;

            if (_step.NextStepId.HasValue)
            {
                nextStep = GetStep(_step.NextStepId.Value);
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