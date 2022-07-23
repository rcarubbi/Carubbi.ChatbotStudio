using Autofac;
using Autofac.Integration.WebApi;
using Carubbi.BotEditor.Api.BotOverrides.Autofac;
using Carubbi.BotEditor.Backend.Domain.Autofac;
using Carubbi.BotEditor.Config.WebApiIntegration;
using Carubbi.BotEditor.Services.Autofac;
using Microsoft.Bot.Builder.Azure;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace Carubbi.BotEditor.Api
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            WebApiIntegration.ConfigureSerializer();
          
            Conversation.UpdateContainer(builder =>
            {
                builder.RegisterModule(new BotConfigModule());
                builder.RegisterModule(new DefaultExceptionMessageOverrideModule());
                builder.RegisterModule(new ServicesModule());
                var resolveAssembly = Assembly.GetExecutingAssembly();
                builder.RegisterModule(new AzureModule(resolveAssembly));
                builder.RegisterApiControllers(resolveAssembly);

                // Prevent DeleteProfileScorable
                builder.Register(c => new Regex("(?!x)x", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.IgnorePatternWhitespace))
                        .Keyed<Regex>(DialogModule.Key_DeleteProfile_Regex)
                        .SingleInstance();
            });


            TenantManager tenantManager = new TenantManager();
            tenantManager.ConfigureTenants();
            
            
            GlobalConfiguration.Configure(WebApiConfig.Register);
        }

      
    }
}
