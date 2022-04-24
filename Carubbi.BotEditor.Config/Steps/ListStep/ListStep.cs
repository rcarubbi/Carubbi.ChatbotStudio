using Carubbi.BotEditor.Config.NLP;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ListStep : Step, INLPStep, IOutput<ListStepResult>
    {
        public Settings NLPSettings { get; set; }

        public ListTypes ListType { get; set; }

        public List<ListItem> Input { get; set; }

        public ListStepResult Output { get; set; }

        public bool Durable { get; set; }

        public MessageInteractions RetryMessage { get; set; }
        public MessageInteractions TooManyAttemptsMessage { get; set; }
        public MessageInteractions PromptMessage { get; set; }
        public int? Attempts { get; set; }
        INLPResult INLPStep.Output {
            get => Output;
            set => Output = (ListStepResult)value;
        }
    }
}
