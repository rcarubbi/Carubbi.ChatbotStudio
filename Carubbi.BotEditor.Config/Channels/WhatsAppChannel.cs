using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Channels
{
    [Serializable]
    public class WhatsAppChannel 
    {
        public List<string> PhoneNumbers { get; set; }
    }
}

