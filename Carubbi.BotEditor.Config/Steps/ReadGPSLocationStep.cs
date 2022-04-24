using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ReadGPSLocationStep : Step, IOutput<ReadGPSLocationResult>
    {

        public MessageInteractions AskLocationMessage { get; set; }

        public int? Attempts { get; set; }

        public MessageInteractions RetryMessage { get; set; }

        public MessageInteractions TooManyAttemptsMessage { get; set; }

        public ReadGPSLocationResult Output
        {
            get;
            set;
        }

        public bool Durable { get; set; }
        public int? ErrorStepId { get; set; }
        
    }
}
