using System;

namespace Carubbi.BotEditor.Config
{
    [Serializable]
    public class SpeechRecognitionSettings : ICloneable
    {
        public string SubscriptionKey { get; set; }
        public string ServiceRegion { get; set; }
        public string Language { get; set; }
        public SpeechRecognitionServiceType ServiceType { get; set; }

        public object Clone()
        {
            return new SpeechRecognitionSettings
            {
                SubscriptionKey = SubscriptionKey,
                Language = Language,
                ServiceRegion = ServiceRegion,
                ServiceType = ServiceType
            };
        }
    }
}