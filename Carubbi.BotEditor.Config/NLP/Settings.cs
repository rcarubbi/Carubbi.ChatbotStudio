using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.NLP
{
    [Serializable]
    public class Settings
    {
        public Settings()
        {
            Models = new List<Model>();
        }

        public List<Model> Models { get; set; }
        public NlpServiceType ServiceType { get; set; }
    }
}