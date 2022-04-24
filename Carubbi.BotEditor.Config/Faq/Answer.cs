using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Faq
{
   
    [Serializable]
    public class Answer
    {
        public List<string> Questions { get; set; }

        public string Text { get; set; }

        public double Score { get; set; }
    }
}