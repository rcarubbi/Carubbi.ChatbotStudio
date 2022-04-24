using Microsoft.Bot.Builder.Dialogs;
using System;

namespace Carubbi.BotEditor.FormsIntegration
{
    [Serializable]
    public class StateCallBack
    {
        public event EventHandler<StateEventArgs> OnStateCompleted;

        public void SetState(IDialogContext context, object state, bool formCancelled)
        {
        
            OnStateCompleted?.Invoke(this, new StateEventArgs { State = state, Context = context, FormCancelled = formCancelled });
        }
    }
}
