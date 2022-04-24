using Microsoft.Bot.Builder.Dialogs;
using System;

namespace Carubbi.BotEditor.FormsIntegration
{
   
    public class StateEventArgs : EventArgs
    {
        public bool FormCancelled { get; set; }
        public object State { get; set; }

        public IDialogContext Context { get; set; }
    }
}