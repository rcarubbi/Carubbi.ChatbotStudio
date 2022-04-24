using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Web;
using System.Web.Http;

namespace Carubbi.BotEditor.Backend.Api.Controllers
{
    public class BaseApiController : ApiController
    {
        public string LoggedUser
        {
            get
            {
                var signedInIdentity = Request.GetOwinContext().Request.User.Identity as ClaimsIdentity;
                if (signedInIdentity != null)
                    return signedInIdentity.Claims.Single(c => c.Type == ClaimTypes.Name).Value;
                return string.Empty;
            }
        }

        public string[] Permissions
        {
            get
            {
                var signedInIdentity = Request.GetOwinContext().Request.User.Identity as ClaimsIdentity;
                if (signedInIdentity == null) return new string[] { };

                return signedInIdentity.Claims
                        .Where(c => c.Type == ClaimTypes.Role)
                        .Select(c => c.Value)
                        .ToArray();
            }
        }
    }
}