using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class SwitchStep : Step
    {
        public string Input { get; set; }

        public List<Case> Cases { get;set; }
    }
}
