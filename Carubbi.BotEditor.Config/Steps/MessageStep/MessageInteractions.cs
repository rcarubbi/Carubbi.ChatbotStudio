using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class MessageInteractions
    {
        public List<string> Typed { get; set; }

        public List<string> Spoken { get; set; }

        public List<AttachedFile> Files { get; set; }

        public List<string> GetMessages(bool spokenInteraction)
        {
            return spokenInteraction && Spoken?.Count > 0
               ? Spoken
               : Typed;
        }
    }
}