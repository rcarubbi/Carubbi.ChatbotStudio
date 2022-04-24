using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Models.Response
{
    public class BotRuntimeResponse
    {
        public BotRuntimeResponse()
        {
            FormStepResults = new List<FormStepResult>();
        }
        public List<FormStepResult> FormStepResults { get; set; }
    }
}
