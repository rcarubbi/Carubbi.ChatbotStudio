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
                ? new string[] { "Sim" } 
                : _step.Configuration?.Yes;

            formBuilder.Configuration.No = _step.Configuration?.No.Length == 0 
                ? new string[] { "Não" } 
                : _step.Configuration?.No;

            formBuilder.Configuration.NoPreference = _step.Configuration?.NoPreferenceMessage.Length == 0 
                ? new string[] { "Nenhum" } 
                : _step.Configuration?.NoPreferenceMessage;

            formBuilder.Configuration.DefaultPrompt.ChoiceLastSeparator = _step.Configuration?.ChoiceLastSeparator ?? ", ou ";
            formBuilder.Configuration.DefaultPrompt.LastSeparator = _step.Configuration?.LastSeparator ?? ", e ";

            formBuilder.Configuration.Navigation = _step.Configuration?.NavigationFieldName ?? "Nome do campo";
            
            formBuilder.Configuration.CurrentChoice = _step.Configuration?.CurrentChoiceMessage.Length == 0 
                ? new string[] { "atual" } 
                : _step.Configuration?.CurrentChoiceMessage;

            var messages = new Dictionary<TemplateUsage, string>
            {
                {
                    TemplateUsage.BoolHelp,
                    _step.Configuration?.BoolHelpMessage ?? "Por favor responda 'sim' ou 'não' {?, {0}}"
                },
                {
                    TemplateUsage.Bool,
                    _step.Configuration?.BoolMessage ?? "Você gostaria de um(a) {&}? {||}"
                },
                {
                    TemplateUsage.Clarify,
                    _step.Configuration?.ClarifyMessage ?? "Por \"{0}\" {&} você quis dizer {||}"
                },
                {
                    TemplateUsage.Confirmation,
                    _step.Configuration?.ConfirmationMessage ?? "{*} Confira se as informações estão corretas. {||}"
                },
                {
                    TemplateUsage.CurrentChoice,
                    _step.Configuration?.DateTimeMessage ?? "(Escolha atual: {})"
                },
                {
                    TemplateUsage.DateTime,
                    _step.Configuration?.DateTimeMessage ?? "Por favor, digite uma data e hora para {&} {||}"
                },
                {
                    TemplateUsage.DateTimeHelp,
                    _step.Configuration?.DateTimeHelpMessage ?? "Por favor digite uma expressão de data e hora {?, {0}}{?, {1}}."
                },
                {
                    TemplateUsage.Double,
                    _step.Configuration?.DoubleMessage ?? "Por favor informe um número {?entre {0:F1} e {1:F1}} para {&} {||}"
                },
                {
                    TemplateUsage.DoubleHelp,
                    _step.Configuration?.DoubleHelpMessage ?? "Por favor informe um número{? entre {2:F1} e {3:F1}}{?, {0}}{?, {1}}."
                },
                {
                    TemplateUsage.EnumManyNumberHelp,
                    _step.Configuration?.EnumManyNumberHelpMessage ?? "Você pode informar um ou mais números {0}-{1} ou palavras a partir das descrições. ({2})"
                },
                {
                    TemplateUsage.EnumManyWordHelp,
                    _step.Configuration?.EnumManyWordHelpMessage ?? "Você pode informar uma ou mais seleções a partir das descrições. ({2})"
                },
                {
                    TemplateUsage.EnumOneNumberHelp,
                    _step.Configuration?.EnumOneNumberHelpMessage ?? "Você pode informar um número {0}-{1} ou palavras a partir das descrições. ({2})"
                },
                {
                    TemplateUsage.EnumOneWordHelp,
                    _step.Configuration?.EnumOneWordHelpMessage ?? "Você pode informar qualquer palavra a partir das descrições. ({2})"
                },
                {
                    TemplateUsage.EnumSelectMany,
                    _step.Configuration?.EnumSelectManyMessage ?? "Por favor, informe um(a) ou mais {&} {||}"
                },
                {
                    TemplateUsage.EnumSelectOne,
                    _step.Configuration?.EnumSelectOneMessage ?? "Por favor selecione um(a) {&} {||}"
                },
                {
                    TemplateUsage.Feedback,
                    _step.Configuration?.FeedBackMessage ??  "Para '{&}' eu entendi {}." // {?\"{0}\" não é uma opção válida.}
                },
                {
                    TemplateUsage.Help,
                    _step.Configuration?.HelpMessage ??   "Você está preenchendo o campo {&}. \r\n Guia de Ajuda: \r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.HelpClarify,
                    _step.Configuration?.HelpClarifyMessage ??  "Você está confirmando o valor de {&}.  Resposta possível:\r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.HelpConfirm,
                    _step.Configuration?.HelpConfirmMessage ??  "Por favor responda a pergunta.  Resposta possível:\r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.HelpNavigation,
                    _step.Configuration?.HelpNavigationMessage ?? "Escolha qual campo deseja modificar.  Resposta possível:\r\n{0}\r\n{1}"
                },
                {
                    TemplateUsage.Integer,
                    _step.Configuration?.IntegerMessage ?? "Por favor informe um número{? entre {0} e {1}} para {&} {||}"
                },
                {
                    TemplateUsage.IntegerHelp,
                    _step.Configuration?.IntegerHelpMessage ??  "Você pode informar um número{? entre {2} e {3}}{?, {0}}{?, {1}}."
                },
                 {
                    TemplateUsage.Navigation,
                    _step.Configuration?.NavigationMessage ?? "O que você deseja alterar? {||}"
                },
                {
                    TemplateUsage.NavigationFormat,
                    _step.Configuration?.NavigationFormatMessage ?? "{&}({})"
                },
                {
                    TemplateUsage.NavigationHelp,
                    _step.Configuration?.NavigationHelpMessage ?? "Escolha {?um número de {0}-{1}, ou} o nome de um campo."
                },
                {
                    TemplateUsage.NoPreference,
                    _step.Configuration?.NoPreferenceMessage?.FirstOrDefault() ?? "Nenhum"
                },
                {
                    TemplateUsage.NotUnderstood,
                    _step.Configuration?.NotUnderstoodMessage ?? "\"{0}\" não é uma opção para { &}."
                },
                {
                    TemplateUsage.StatusFormat,
                    _step.Configuration?.StatusFormatMessage ?? "{&}: {}"
                },
                {
                    TemplateUsage.String,
                    _step.Configuration?.StringMessage ?? "Por favor, informe {&} {||}"
                },
                {
                    TemplateUsage.StringHelp,
                    _step.Configuration?.StringHelpMessage ?? "Você pode digitar o que quiser (use \"'s para forçar texto){?, {0}}{?, {1}}."
                },
                {
                    TemplateUsage.Unspecified,
                    _step.Configuration?.UnspecifiedMessage ??  "Não respondido"
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
                    new CommandDescription(_step.Configuration?.Commands.HelpDescription ?? "Ajuda",
                    _step.Configuration?.Commands.HelpTerms ?? new string[] { "/ajuda" },
                    _step.Configuration?.Commands.HelpHelpMessage ?? "você pode digitar /ajuda para saber quais comandos estão disponíveis")
                },
                 {
                    FormCommand.Backup,
                    new CommandDescription(_step.Configuration?.Commands.BackupDescription ?? "Voltar",
                    _step.Configuration?.Commands.BackupTerms ?? new string[] { "/voltar" },
                    _step.Configuration?.Commands.BackupHelpMessage ?? "você pode digitar /voltar para responder novamente a questão anterior")
                },
                  {
                    FormCommand.Reset,
                    new CommandDescription(_step.Configuration?.Commands.ResetDescription ?? "Reiniciar",
                    _step.Configuration?.Commands.ResetTerms ?? new string[] { "/reiniciar" },
                    _step.Configuration?.Commands.ResetHelpMessage ?? "você pode digitar /reiniciar para recomeçar este diálogo")
                },
                   {
                    FormCommand.Quit,
                    new CommandDescription(_step.Configuration?.Commands.QuitDescription ?? "Sair",
                    _step.Configuration?.Commands.QuitTerms ?? new string[] { "/sair" },
                    _step.Configuration?.Commands.QuitHelpMessage ?? "você pode digitar /sair para desistir deste diálogo")
                },
                    {
                    FormCommand.Status,
                    new CommandDescription(_step.Configuration?.Commands.StatusDescription ?? "Status",
                    _step.Configuration?.Commands.StatusTerms ?? new string[] { "/status" },
                    _step.Configuration?.Commands.StatusHelpMessage ?? "você pode digitar /status para visualizar suas respostas informadas até o momento")
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
