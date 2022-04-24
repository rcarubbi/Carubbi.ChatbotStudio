using System;

namespace Carubbi.BotEditor.Config
{
    [Serializable]
    public class SpeechSettings : ICloneable
    {
        public SpeechRecognitionSettings Recognition { get; set; }

        public SpeechSynthesisSettings Synthesis { get; set; }

        public object Clone()
        {
            return new SpeechSettings
            {
                Recognition = (SpeechRecognitionSettings)Recognition.Clone(),
                Synthesis = (SpeechSynthesisSettings)Synthesis.Clone()
            };
        }
    }
}