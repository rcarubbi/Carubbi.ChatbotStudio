
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Config.WebApiIntegration;
using Carubbi.BotEditor.SamplesApi.Models;
using System.Collections.Generic;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class SUVOptionsSourceController : ApiController, IFormStepOptionsSourceController<SampleForm, SampleFormRequest>
    {
        public List<FieldOption> Post(SampleFormRequest request)
        {
            return new List<FieldOption>
            {
                new FieldOption
                {
                    Order = 1,
                    Description = "GPS",
                    Value = "GPS"
                },
                new FieldOption
                {
                    Order = 2,
                    Description = "Central Multimídia",
                    Value = "CentralMultimidia"
                }
            };
        }
    }
}
