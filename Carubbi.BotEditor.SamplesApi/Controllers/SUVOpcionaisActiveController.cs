using Carubbi.BotEditor.Config.WebApiIntegration;
using Carubbi.BotEditor.SamplesApi.Models;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class SUVOpcionaisActiveController : ApiController, IFormStepActiveController<SampleForm, SampleFormRequest>
    {
        public bool Post(SampleFormRequest request)
        {
            return (request.State.TipoDeCarroPreferido == TipoCarro.SUV); 
        }
    }
}
