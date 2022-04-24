using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.WebApiIntegration;

namespace Carubbi.BotEditor.SamplesApi.Models
{
    public class ShowroomCancelarDependentesFormRequest : IFormStepIntegrationRequest<ShowroomCancelarDependentesForm>
    {
        public ShowroomCancelarDependentesForm State { get; set; }
        public BotConfig BotConfig { get; set; }
    }
}