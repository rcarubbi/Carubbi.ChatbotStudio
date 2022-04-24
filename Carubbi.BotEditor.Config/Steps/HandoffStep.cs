using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class HandoffStep : Step, IOutput<object>
    {
        public string Endpoint { get; set; }

        public object Output { get; set; }

        public bool Durable { get; set; }
    }
}
