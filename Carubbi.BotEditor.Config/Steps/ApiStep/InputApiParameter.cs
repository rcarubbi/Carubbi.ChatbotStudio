 
using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ApiParameter
    {
        public string Name { get; set; }

        public string Value { get; set; }

        public ParameterTypes Type { get; set; }
    }
}