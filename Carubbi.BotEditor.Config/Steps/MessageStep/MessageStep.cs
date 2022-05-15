using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class MessageStep : Step
    {
        public MessageInteractions Messages { get; set; }
    }
}
