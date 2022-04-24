using System;

namespace Carubbi.BotEditor.Config.ImageClassification
{
    [Serializable]
    public class ClassificationResult
    {
        public string Tag { get; set; }

        public double Score { get; set; }

    }
}
