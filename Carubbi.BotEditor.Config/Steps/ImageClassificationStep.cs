using Carubbi.BotEditor.Config.ImageClassification;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ImageClassificationStep : Step, IOutput<List<ClassificationResult>>
    {
        public ImageClassificationStep()
        {
            Output = new List<ClassificationResult>();
        }
        public List<ClassificationResult> Output { get; set; }

        public bool Durable { get; set; }

        public float MinScore { get; set; }

        public int MaxResults { get; set; }

        public MessageInteractions RetryMessage { get; set; }

        public Settings ImageClassificationSettings { get; set; }
        public MessageInteractions AskImageMessage { get; set; }
        public int? Attempts { get; set; }
        public int? ErrorStepId { get; set; }
        public MessageInteractions TooManyAttemptsMessage { get; set; }
    }
}
