using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.WebApiIntegration;

namespace Carubbi.BotEditor.SamplesApi.Models
{
    public class SampleFormRequest : IFormStepIntegrationRequest<SampleForm>
    {
        public SampleForm State { get; set; }

        public BotConfig BotConfig { get; set; }
    }
}