using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Models.Request
{
    public class BotRuntimeRequest
    {
        public BotConfig BotConfig { get; set; }
        public List<FormStep> FormSteps { get; set; }
    }
}
