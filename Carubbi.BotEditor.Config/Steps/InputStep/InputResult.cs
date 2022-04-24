using Carubbi.BotEditor.Config.NLP;
using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class InputResult : INLPResult
    {
        public double? SentimentScore { get; set; }

        public string Answer { get; set; }

        public Result NLPResult { get; set; }
    }
}