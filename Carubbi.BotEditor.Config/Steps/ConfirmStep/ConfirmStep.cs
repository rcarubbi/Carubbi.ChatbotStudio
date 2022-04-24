using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ConfirmStep : Step, IOutput<ConfirmResult>
    {
        public MessageInteractions Question { get; set; }
        public MessageInteractions RetryMessage { get; set; }
        public MessageInteractions TooManyAttemptsMessage { get; set; }

        public int TrueStepId { get; set; }

        public int FalseStepId { get; set; }

        public ConfirmResult Output { get; set; }

        public bool Durable { get; set; }

        public string YesText { get; set; }
        public string NoText { get; set; }
        public string[] NoAcceptedAnswers { get; set; }
        public string[] YesAcceptedAnswers { get; set; }
        public int? Attempts { get; set; }
    }
}
