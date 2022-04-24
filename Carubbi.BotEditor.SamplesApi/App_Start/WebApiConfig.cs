using Carubbi.BotEditor.Config.WebApiIntegration;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            WebApiIntegration.ConfigureFormatter(config);
            
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
