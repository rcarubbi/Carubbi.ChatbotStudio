using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class FormConfig
    {
        public string[] Yes { get; set; }
        public string[] No { get; set; }

        public string[] NoPreferenceMessage { get; set; }

        public string ChoiceLastSeparator { get; set; }
        public string LastSeparator { get; set; }
        public string NavigationFieldName { get; set; }
        public string[] CurrentChoiceMessage { get; set; }

        public string BoolHelpMessage { get; set; }
        public string BoolMessage { get; set; }
        public string ClarifyMessage { get; set; }
        public string ConfirmationMessage { get; set; }
        public string DateTimeMessage { get; set; }
        public string DateTimeHelpMessage { get; set; }
        public string DoubleHelpMessage { get; set; }
        public string DoubleMessage { get; set; }
        public string EnumManyNumberHelpMessage { get; set; }
        public string EnumOneNumberHelpMessage { get; set; }
        public string EnumSelectManyMessage { get; set; }
        public string EnumOneWordHelpMessage { get; set; }
        public string EnumSelectOneMessage { get; set; }
        public string FeedBackMessage { get; set; }
        public string HelpMessage { get; set; }
        public string HelpClarifyMessage { get; set; }
        public string HelpConfirmMessage { get; set; }
        public string HelpNavigationMessage { get; set; }
        public string IntegerMessage { get; set; }
        public string IntegerHelpMessage { get; set; }
        public string NavigationMessage { get; set; }
        public string NavigationCommandHelpMessage { get; set; }
        public string NavigationFormatMessage { get; set; }
        public string NavigationHelpMessage { get; set; }
        public string NotUnderstoodMessage { get; set; }
        public string StatusFormatMessage { get; set; }
        public string StringMessage { get; set; }
        public string StringHelpMessage { get; set; }
        public string UnspecifiedMessage { get; set; }
        public ConfigCommands Commands { get; set; }
        public string EnumManyWordHelpMessage { get; set; }
    }
}
