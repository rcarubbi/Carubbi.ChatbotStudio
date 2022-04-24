using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Config.WebApiIntegration;
using Carubbi.BotEditor.SamplesApi.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class ShowroomListarPlanosController : ApiController, IFormStepOptionsSourceController<ShowroomCancelarDependentesForm, ShowroomCancelarDependentesFormRequest>
    {
        public List<FieldOption> Post(ShowroomCancelarDependentesFormRequest request)
        {
            
            return new List<FieldOption>
            {
                new FieldOption
                {
                    Order = 1,
                    Description = "Plano de Saúde",
                    Value = "Saude"
                },
                new FieldOption
                {
                    Order = 2,
                    Description = "Plano Odontológico",
                    Value = "Odonto"
                },
            };
        }
    }
}