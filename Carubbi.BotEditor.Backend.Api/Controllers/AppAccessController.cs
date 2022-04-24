using Carubbi.BotEditor.Backend.Domain.Services;
using System.Web.Http;

namespace Carubbi.BotEditor.Backend.Api.Controllers
{
    public class AppAccessController : ApiController
    {
        private readonly AppAccessService _appAccessService;

        public AppAccessController(AppAccessService appAccessService)
        {
            _appAccessService = appAccessService;
        }
        public IHttpActionResult Post([FromBody] string applicationName)
        {
            var appAccess = _appAccessService.GrantApplication(applicationName);
            return Ok(appAccess);
        }

    }
}