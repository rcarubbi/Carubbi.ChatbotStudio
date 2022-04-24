using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class FieldOption
    {
        public int Order { get; set; }

        public string Value { get; set; }

        public string Description { get; set; }
    }
}