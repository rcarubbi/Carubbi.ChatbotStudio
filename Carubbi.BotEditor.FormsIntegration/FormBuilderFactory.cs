using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.FormFlow;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.FormsIntegration
{
    public class FormBuilderFactory<T> where T : class
    {
        private readonly FormStep _step;
        public FormBuilderFactory(FormStep step)
        {
            _step = step;
        }

        public FormBuilder<T> Create()
        {
            var formBuilder = new FormBuilder<T>();

            formBuilder.Configuration.Yes = _step.Configuration?.Yes.Length == 0 
                ? new string[] { "Yes" } 
                : _step.Configuration?.Yes;

            formBuilder.Configuration.No = _step.Configuration?.No.Length == 0 
                ? new string[] { "No" } 
                : _step.Configuration?.No;

            formBuilder.Configuration.NoPreference = _step.Configuration?.NoPreferenceMessage.Length == 0 
                ? new string[] { "None" } 
                : _step.Configuration?.NoPreferenceMessage;

            formBuilder.Configuration.DefaultPrompt.ChoiceLastSeparator = _step.Configuration?.ChoiceLastSeparator ?? ", or ";
            formBuilder.Configuration.DefaultPrompt.LastSeparator = _step.Configuration?.LastSeparator ?? ", and ";

            formBuilder.Configuration.Navigation = _step.Configuration?.NavigationFieldName ?? "Field name";
            
            formBuilder.Configuration.CurrentChoice = _step.Configuration?.CurrentChoiceMessage.Length == 0 
                ? new string[] { "current" } 
                : _step.Configuration?.CurrentChoiceMessage;

            var messages = new Dictionary<TemplateUsage, string>
            {
                {
                    TemplateUsage.BoolHelp,
                    _step.Configuration?.BoolHelpMessage ?? "Please answer 'yes' or 'no' {?, {0}}"
                },
                {
                    TemplateUsage.Bool,
                    _step.Configuration?.BoolMessage ?? "Would you like a {&}? {||}"
                },
                {
                    TemplateUsage.Clarify,
                    _step.Configuration?.ClarifyMessage ?? "By \"{0}\" {&} you mean {||}"
                },
                {
                    TemplateUsage.Confirmation,
                    _step.Configuration?.ConfirmationMessage ?? "{*} Check if the information is correct. {||}"
                },
                {
                    TemplateUsage.CurrentChoice,
                    _step.Configuration?.DateTimeMessage ?? "(Current choice: {})"
                },
                {
                    TemplateUsage.DateTime,
                    _step.Configuration?.DateTimeMessage ?? "Please, input a date and time for {&} {||}"
                },
                {
                    TemplateUsage.DateTimeHelp,
                    _step.Configuration?.DateTimeHelpMessage ?? "Please, type a date time expression {?, {0}}{?, {1}}."
                },
                {
                    TemplateUsage.Double,
                    _step.Configuration?.DoubleMessage ?? "Please inform a number {?between {0:F1} and {1:F1}} for {&} {||}"
                },
                {
                    TemplateUsage.DoubleHelp,
                    _step.Configuration?.DoubleHelpMessage ?? "Please inform a number{? between {2:F1} and {3:F1}}{?, {0}}{?, {1}}."
                },
                {
                    TemplateUsage.EnumManyNumberHelp,
                    _step.Configuration?.EnumManyNumberHelpMessage ?? "You can inform one or more numbers {0}-{1} or words from the descriptions. ({2})"
                },
                {
                    TemplateUsage.EnumManyWordHelp,
                    _step.Configuration?.EnumManyWordHelpMessage ?? "You can inform one or more selections from the descriptions. ({2})"
                },
                {
                    TemplateUsage.EnumOneNumberHelp,
                    _step.Configuration?.EnumOneNumberHelpMessage ?? "You can inform a number {0}-{1} or words from the descriptions. ({2})"
                },
                {
                    TemplateUsage.EnumOneWordHelp,
                    _step.Configuration?.EnumOneWordHelpMessage ?? "You can inform any word from the descriptions. ({2})"
                },
                {
                    TemplateUsage.EnumSelectMany,
                    _step.Configuration?.EnumSelectManyMessage ?? "Please, inform one or more {&} {||}"
                },
                {
                    TemplateUsage.EnumSelectOne,
                    _step.Configuration?.EnumSelectOneMessage ?? "Please, select a {&} {||}"
                },
                {
                    TemplateUsage.Feedback,
                    _step.Configuration?.FeedBackMessage ??  "For '{&}' i understood {}." // {?\"{0}\" is not a valid option.}
                },
                {
                    TemplateUsage.Help,
                    _step.Configuration?.HelpMessage ??   "You are filling the field {&}. \r\n Help guide: \r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.HelpClarify,
                    _step.Configuration?.HelpClarifyMessage ??  "You are confirming the value of {&}.  Possible answer:\r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.HelpConfirm,
                    _step.Configuration?.HelpConfirmMessage ??  "Please answer the question.  Possible answer:\r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.HelpNavigation,
                    _step.Configuration?.HelpNavigationMessage ?? "Chose which field you want to modify. Possible answer:\r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.Integer,
                    _step.Configuration?.IntegerMessage ?? "Please inform a number{? between {0} and {1}} for {&} {||}"
                },
                {
                    TemplateUsage.IntegerHelp,
                    _step.Configuration?.IntegerHelpMessage ??  "You can inform a number{? between {2} and {3}}{?, {0}}{?, {1}}."
                },
                 {
                    TemplateUsage.Navigation,
                    _step.Configuration?.NavigationMessage ?? "What do you want to modify? {||}"
                },
                {
                    TemplateUsage.NavigationFormat,
                    _step.Configuration?.NavigationFormatMessage ?? "{&}({})"
                },
                {
                    TemplateUsage.NavigationHelp,
                    _step.Configuration?.NavigationHelpMessage ?? "Chose {?a number from {0}-{1}, or} the field name."
                },
                {
                    TemplateUsage.NoPreference,
                    _step.Configuration?.NoPreferenceMessage?.FirstOrDefault() ?? "None"
                },
                {
                    TemplateUsage.NotUnderstood,
                    _step.Configuration?.NotUnderstoodMessage ?? "\"{0}\" is not an options for { &}."
                },
                {
                    TemplateUsage.StatusFormat,
                    _step.Configuration?.StatusFormatMessage ?? "{&}: {}"
                },
                {
                    TemplateUsage.String,
                    _step.Configuration?.StringMessage ?? "Please, inform {&} {||}"
                },
                {
                    TemplateUsage.StringHelp,
                    _step.Configuration?.StringHelpMessage ?? "You can type anything you want (use \"'s to force text){?, {0}}{?, {1}}."
                },
                {
                    TemplateUsage.Unspecified,
                    _step.Configuration?.UnspecifiedMessage ??  "Not answered"
                },
            };

            var templateUsages = Enum.GetValues(typeof(TemplateUsage)).Cast<TemplateUsage>();

            foreach (var templateUsage in templateUsages)
            {
                if (messages.ContainsKey(templateUsage)) {
                    formBuilder.Configuration.Template(templateUsage).Patterns = new string[] { messages[templateUsage] };
                }
            }
            var formCommands = Enum.GetValues(typeof(FormCommand)).Cast<FormCommand>();
            formBuilder.Configuration.Commands.Clear();

            var commands = new Dictionary<FormCommand, CommandDescription> {
                {
                    FormCommand.Help,
                    new CommandDescription(_step.Configuration?.Commands.HelpDescription ?? "Help",
                    _step.Configuration?.Commands.HelpTerms ?? new string[] { "/help" },
                    _step.Configuration?.Commands.HelpHelpMessage ?? "you can type /help to know the available commands")
                },
                 {
                    FormCommand.Backup,
                    new CommandDescription(_step.Configuration?.Commands.BackupDescription ?? "Back",
                    _step.Configuration?.Commands.BackupTerms ?? new string[] { "/back" },
                    _step.Configuration?.Commands.BackupHelpMessage ?? "you can type /back to answer a previous question again")
                },
                  {
                    FormCommand.Reset,
                    new CommandDescription(_step.Configuration?.Commands.ResetDescription ?? "Restart",
                    _step.Configuration?.Commands.ResetTerms ?? new string[] { "/restart" },
                    _step.Configuration?.Commands.ResetHelpMessage ?? "you can type /restart to restart a dialog")
                },
                   {
                    FormCommand.Quit,
                    new CommandDescription(_step.Configuration?.Commands.QuitDescription ?? "Quit",
                    _step.Configuration?.Commands.QuitTerms ?? new string[] { "/quit" },
                    _step.Configuration?.Commands.QuitHelpMessage ?? "you can type /quit to give up a dialog")
                },
                    {
                    FormCommand.Status,
                    new CommandDescription(_step.Configuration?.Commands.StatusDescription ?? "Status",
                    _step.Configuration?.Commands.StatusTerms ?? new string[] { "/status" },
                    _step.Configuration?.Commands.StatusHelpMessage ?? "you can type /status to review your answers")
                },
            };

            foreach (var formCommand in formCommands)
            {
                formBuilder.Configuration.Commands.Add(formCommand, commands[formCommand]);
            }

            return formBuilder;
        }
    }
}
