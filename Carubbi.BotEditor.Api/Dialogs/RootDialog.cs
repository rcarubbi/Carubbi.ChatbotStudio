using Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class RootDialog : BaseDialog<object, Step>
    {
        

        public RootDialog(ILifetimeScope scope, BotConfig botConfig)
            : base(botConfig, null, null)
        {
   
        }

        protected override Task PerformStartAsync(IDialogContext context)
        {
          
            context.Wait(MessageReceivedAsync);
            return Task.CompletedTask;
        }

       

        private async Task MessageReceivedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as Activity;
            

            var rootStepId = _botConfig.RootStepId;

            Step rootStep = null;
            try
            {
                rootStep = GetStep(rootStepId);
                _botConfig.StartMessage = activity.Text;
            }
            catch
            {
                await context.PostAsync(Constants.COULD_NOT_LOAD_ROOT_STEP_MESSAGE);
            }

            if (rootStep != null)
            {
                var dialog = rootStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                if (dialog != null)
                {
                    context.Call(dialog, GoBack);
                } else
                {
                    context.Done<object>(null);
                }
            }
        }
    }
}