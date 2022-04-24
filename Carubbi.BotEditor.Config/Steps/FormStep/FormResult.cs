using Carubbi.BotEditor.Config.NLP;
using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class FormResult : INLPResult
    {
        public bool FormCancelled { get; set; }

        public Result NLPResult { get; set; }

        public object Form { get; set; }
    }
}