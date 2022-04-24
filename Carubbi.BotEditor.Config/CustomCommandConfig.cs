using System;

namespace Carubbi.BotEditor.Config
{
    [Serializable]
    public class CustomCommandConfig
    {
        public string CommandText { get; set; }

        public bool ClearDialogStack { get; set; }
        public bool DeleteProfile { get; set; }

        public bool InvalidateCache { get; set; }

        public string CustomMessageReply { get; set; }
        public bool Startup { get; set; }
    }
}