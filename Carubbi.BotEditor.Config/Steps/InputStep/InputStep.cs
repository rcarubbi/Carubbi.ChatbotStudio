using Carubbi.BotEditor.Config.NLP;
using Carubbi.BotEditor.Config.TextAnalysis;
using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class InputStep : Step, INLPStep, IOutput<InputResult>
    {
        public TextAnalysisSettings TextAnalysisSettings { get; set; }

        public Settings NLPSettings { get; set; }

        public InputResult Output { get; set; }

        public bool Durable { get; set; }

        public MessageInteractions Question { get; set; }

        INLPResult INLPStep.Output
        {
            get { return Output; }
            set { Output = (InputResult)value; }
        }
    }
}
