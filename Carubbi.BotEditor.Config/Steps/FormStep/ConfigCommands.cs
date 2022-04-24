using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ConfigCommands
    {
        public string HelpDescription { get; set; }
        public string[] HelpTerms { get; set; }
        public string HelpHelpMessage { get; set; }
        public string BackupDescription { get; set; }
        public string ResetDescription { get; set; }
        public string QuitDescription { get; set; }
        public string StatusDescription { get; set; }
        public string[] BackupTerms { get; set; }
        public string BackupHelpMessage { get; set; }
        public string[] ResetTerms { get; set; }
        public string ResetHelpMessage { get; set; }
        public string[] QuitTerms { get; set; }
        public string QuitHelpMessage { get; set; }
        public string[] StatusTerms { get; set; }
        public string StatusHelpMessage { get; set; }
    }
}