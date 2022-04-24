using Autofac;
using Autofac.Integration.WebApi;
using Autofac.Multitenant;
using Carubbi.BotEditor.Config;
using Microsoft.Bot.Connector;
using System.Threading.Tasks;
using System.Web.Http;

namespace Carubbi.BotEditor.Api
{
    public class BotConfigBasedCredentialProvider : ICredentialProvider
    {
        private readonly MultitenantContainer _container;

        public BotConfigBasedCredentialProvider()
        {
            _container = (GlobalConfiguration.Configuration.DependencyResolver as AutofacWebApiDependencyResolver).Container as MultitenantContainer;
        }

        public Task<string> GetAppPasswordAsync(string appId)
        {

            using (var scope = _container.GetCurrentTenantScope().BeginLifetimeScope())
            {
                var setttings = scope.Resolve<BotInstanceSettings>();
                return Task.FromResult(setttings.AppPassword);
            }
        }

        public Task<bool> IsAuthenticationDisabledAsync()
        {
            using (var scope = _container.GetCurrentTenantScope().BeginLifetimeScope())
            {
                var settings = scope.Resolve<BotInstanceSettings>();
                return Task.FromResult(settings?.AppId == null);
            }
        }

        public Task<bool> IsValidAppIdAsync(string appId)
        {
            using (var scope = _container.GetCurrentTenantScope().BeginLifetimeScope())
            {
                var settings = scope.Resolve<BotInstanceSettings>();
                return Task.FromResult(settings.AppId == appId);
            }
        }


    }
}
