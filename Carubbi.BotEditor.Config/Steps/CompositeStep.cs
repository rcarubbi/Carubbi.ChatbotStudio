using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class CompositeStep : Step, IStepsContainer
    {
        public string Name { get; set; }

        public int RootStepId { get; set; }

        public List<Step> Steps { get; set; }

    }
}