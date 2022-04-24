using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public abstract class Step 
    {
        public int Id { get; set; }

        public int? NextStepId { get; set; }

        public string DataSourceExpression { get; set; }
       
    }
}