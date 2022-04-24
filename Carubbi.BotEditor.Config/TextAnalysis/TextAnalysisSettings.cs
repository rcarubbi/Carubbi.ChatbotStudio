using System;

namespace Carubbi.BotEditor.Config.TextAnalysis
{
    [Serializable]
    public class TextAnalysisSettings
    {
        public string Language { get; set; }

        public string SubscriptionKey { get; set; }

        public string Endpoint { get; set; }

        public TextAnalysisServiceType ServiceType { get; set; }
    }
}