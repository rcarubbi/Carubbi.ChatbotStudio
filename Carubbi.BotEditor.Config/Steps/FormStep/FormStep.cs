using Carubbi.BotEditor.Config.NLP;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class FormStep : Step, INLPStep, IOutput<FormResult>
    {
        public List<FormField> FormFields { get; set; }

        public FormResult Output { get; set; }

        public bool Durable { get; set; }

        public int Version { get; set; }

        public Settings NLPSettings { get; set; }

        public string SummaryText { get; set; }

        INLPResult INLPStep.Output { get => Output; set => Output = (FormResult)value; }

        public bool ShowSummary { get; set; }

        public FormConfig Configuration { get; set;  }
        public bool IncludeFieldListOnSummary { get; set; }
        public bool IncludeConfirmationButtonsOnSummary { get; set; }

        public int Hash { get; set; }

        public IEnumerable<FormField> GetStoredFields()
        {
            var fieldNames = FormFields
                .Where(x => x.Type == FieldTypes.Restore)
                .SelectMany(x => x.RestoreFields)
                .Distinct();

            return FormFields.Where(ff => fieldNames.Contains(ff.Name));
        }

        public bool ContainsRestoreFields()
        {
            return FormFields.Any(ff => ff.Type == FieldTypes.Restore);
        }

        public bool HasNlpEntitiesToAttach()
        {
            return FormFields.Any(x => !string.IsNullOrWhiteSpace(x.NlpEntityName));
        }

        public IEnumerable<FormField> GetFieldsWithNlpEntities()
        {
            return FormFields.Where(x => !string.IsNullOrWhiteSpace(x.NlpEntityName));
        }
    }
}
