using System;

namespace Carubbi.BotEditor.Config.ImageClassification
{
    [Serializable]
    public class Settings
    {
        public string ProjectId { get; set; }

        public string PredictionKey { get; set; }

        public string TrainingKey { get; set; }

        public string PredictionEndpoint { get; set; }

        public string TrainingEndpoint { get; set; }

        public ImageClassificationServiceType ServiceType { get; set; }
    }
}
