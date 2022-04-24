using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class Case
    {
        public string Value { get; set; }

        public int TargetStepId { get; set; }
    }
}