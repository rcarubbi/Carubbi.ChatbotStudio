using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class ShowroomEnviarEmailController : ApiController
    {
        public IHttpActionResult Post([FromBody] string email, [FromBody] string linkFatura)
        {
            return Ok();
        }
    }
}