using Autofac;
using Autofac.Integration.WebApi;
using Carubbi.BotEditor.Backend.Api.Autofac;
using Carubbi.BotEditor.Backend.DataAccess.Autofac;
using Microsoft.Owin;
using Owin;
using System.Reflection;
using System.Web.Http;

[assembly: OwinStartup(typeof(Carubbi.BotEditor.Backend.Api.Startup))]

namespace Carubbi.BotEditor.Backend.Api
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            
            WebApiConfig.Register(config);
            
            IContainer container = BuildContainer();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);

            ConfigureCors(app);
            ConfigureAuth(app, container);

            app.UseAutofacMiddleware(container);
            app.UseAutofacWebApi(config);
            app.UseWebApi(config);
                                
        }

        private IContainer BuildContainer()
        {
            ContainerBuilder builder = new ContainerBuilder();
            builder.RegisterModule<RepositoriesModule>();
            builder.RegisterModule<ServicesModule>();
            builder.RegisterModule<InfrastructureModule>();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            return builder.Build();
        }
    }
}
