using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ConditionStep : Step
    {
        public string ConditionExpression { get; set; }

        public int TrueStepId { get; set; }

        public int FalseStepId { get; set; }
    }
}
