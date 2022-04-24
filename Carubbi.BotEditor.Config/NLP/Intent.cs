using System;

namespace Carubbi.BotEditor.Config.NLP
{
    [Serializable]
    public class Intent
    {
        public string Name { get; set; }

        public double Score { get; set; }
    }
}