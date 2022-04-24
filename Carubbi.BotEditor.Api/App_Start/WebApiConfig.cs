    using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.WebApiIntegration;
using System.Web.Http;

namespace Carubbi.BotEditor.Api
{
    public static class WebApiConfig
    {
        public static string BOT_ROUTE_TEMPLATE { get; private set; }

        public static void Register(HttpConfiguration config)
        {
            WebApiIntegration.ConfigureFormatter(config);
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();


            config.Routes.MapHttpRoute(
                name: "Bot",
                routeTemplate: Constants.BOT_ROUTE_TEMPLATE,
                defaults: new { botId = Constants.DEFAULT_BOT_ID, controller = "Messages" }
            );


            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

        }
    }
}
