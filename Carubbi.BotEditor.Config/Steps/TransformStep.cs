using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class TransformStep : Step
    {
        public TransformStep()
        {
            Transformations = new List<Transformation>();
            Output = new List<object>();
        }

        public string PropertyPath { get; set; }

        public List<Transformation> Transformations { get; set; }

        public List<object> Output { get; set; }
    }
}
