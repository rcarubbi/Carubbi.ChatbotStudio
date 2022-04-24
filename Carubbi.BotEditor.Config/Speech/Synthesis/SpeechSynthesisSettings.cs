using System;

namespace Carubbi.BotEditor.Config
{
    [Serializable]
    public class SpeechSynthesisSettings : ICloneable
    {
        public string VoiceName { get; set; }
        public string SubscriptionKey { get; set; }
        public string ServiceRegion { get; set; }
        public string Language { get; set; }
        public SpeechSynthesisServiceType ServiceType { get; set; }
        public SpeechSynthesisCacheType CacheType { get; set; }
        public SpeechSynthesisStoreType StoreType { get; set; }

        public object Clone()
        {
            return new SpeechSynthesisSettings
            {
                VoiceName = VoiceName,
                SubscriptionKey = SubscriptionKey,
                ServiceRegion = ServiceRegion,
                Language = Language,
                ServiceType = ServiceType,
                CacheType = CacheType,
                StoreType = StoreType
            };
        }
    }
}

