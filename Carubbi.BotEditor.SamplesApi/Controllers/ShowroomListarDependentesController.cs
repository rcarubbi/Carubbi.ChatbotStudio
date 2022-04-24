using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Config.WebApiIntegration;
using Carubbi.BotEditor.SamplesApi.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class ShowroomListarDependentesController : ApiController, IFormStepOptionsSourceController<ShowroomCancelarDependentesForm, ShowroomCancelarDependentesFormRequest>
    {
        public List<FieldOption> Post(ShowroomCancelarDependentesFormRequest request)
        {
            
            return new List<FieldOption>
            {
                new FieldOption
                {
                    Order = 1,
                    Description = "Helena Luesi",
                    Value = "Helena Luesi"
                },
                new FieldOption
                {
                    Order = 2,
                    Description = "Carla Luesi Lacoin",
                    Value = "Carla Luesi Lacoin"
                },
                new FieldOption
                {
                    Order = 3,
                    Description = "Rafale Luesi Lacoin",
                    Value = "Rafale Luesi Lacoin"
                }
            };
        }
    }
}