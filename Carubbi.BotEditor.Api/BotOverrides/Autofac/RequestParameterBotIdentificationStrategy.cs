using Autofac.Multitenant;
using System.Linq;
using System.Web;

namespace Carubbi.BotEditor.Api.BotOverrides.Autofac
{
    public class RequestParameterBotIdentificationStrategy : ITenantIdentificationStrategy
    {
        public bool TryIdentifyTenant(out object tenantId)
        {
            tenantId = null;
            try
            {
                tenantId = HttpContext.Current?.Request.Url.Segments.Last().ToLower();
            }
            catch (HttpException)
            {
                // Happens at app startup in IIS 7.0
            }
            return tenantId != null;
        }
    }
}