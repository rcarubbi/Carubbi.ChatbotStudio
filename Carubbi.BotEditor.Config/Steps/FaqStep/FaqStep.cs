using Carubbi.BotEditor.Config.Faq;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class FaqStep : Step, IOutput<List<Answer>>
    {
        public Settings FaqSettings { get; set; }

        public MessageInteractions AskQuestionMessage { get; set; }

        public double MinimumScore { get; set; }

        public List<Answer> Output { get; set; }

        public bool Durable { get; set; }
    }
}
