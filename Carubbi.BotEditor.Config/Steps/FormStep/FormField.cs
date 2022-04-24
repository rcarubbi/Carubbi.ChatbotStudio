using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class FormField
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int Order { get; set; }

        public string Question { get; set; }

        public FieldTypes Type { get; set; }

        public List<FieldOption> Options { get; set; }

        public string ValidationApiURL { get; set; }

        public string ValidationFailedMessage { get; set; }

        public bool Optional { get; set; }

        public string OptionsSource { get; set; }

        public List<string> RestoreFields { get; set; }

        public string NlpEntityName { get; set; }
        public string ActiveApiURL { get; set; }
    }
}