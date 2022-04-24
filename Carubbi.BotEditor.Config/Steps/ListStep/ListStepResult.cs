using Carubbi.BotEditor.Config.NLP;
using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ListStepResult : INLPResult
    {
        public ListItem SelectedListItem { get; set; }

        public Result NLPResult { get; set; }
    }
}