using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.NLP
{
    [Serializable]
    public class Result
    {
        public Intent Intent { get; set; }

        public List<Entity> Entities { get;  set; }
    }
}