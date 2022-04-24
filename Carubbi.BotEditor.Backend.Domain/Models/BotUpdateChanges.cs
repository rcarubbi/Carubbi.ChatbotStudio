
using Carubbi.BotEditor.Config.Steps;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Models
{
    public class BotUpdateChanges
    {
        public BotUpdateChanges()
        {
            FormStepsToUpdate = new List<FormStep>(); 
        }
        public List<FormStep> FormStepsToUpdate { get; set; }

        public string Runtime { get; set; }
    }
}
