using Autofac;
using Autofac.Integration.WebApi;
using Autofac.Multitenant;
using Carubbi.BotEditor.Api.BotOverrides.Autofac;
using Carubbi.BotEditor.Backend.Domain;
using Microsoft.Bot.Builder.Dialogs;
using System;
using System.Configuration;
using System.Web.Http;

namespace Carubbi.BotEditor.Api
{
    public class TenantManager
    {
        private ITenantIdentificationStrategy _botIdStrategy;
        private bool _published;
       
        public TenantManager()
        {
            _botIdStrategy = new RequestParameterBotIdentificationStrategy();
            _published = Convert.ToBoolean(ConfigurationManager.AppSettings["Published"]);
        }

        public void AddTenant(string botId)
        {
            var config = GlobalConfiguration.Configuration;
            var resolver = (AutofacWebApiDependencyResolver)config.DependencyResolver;
            var mtc = (MultitenantContainer)resolver.Container;
            using (var scope = Conversation.Container.BeginLifetimeScope())
            {
                var botConfigService = scope.Resolve<BotConfigService>();
                mtc.ConfigureTenant(botId, b =>
                {
                    var botConfig = botConfigService.GetConfig(botId, _published);
                    var settings = botConfig.ToInstanceSettings();
                    b.Register(ctx => settings).AsSelf();
                    b.RegisterModule(new BotDataStoreModule(settings));
                });
            }
        }

        public void ConfigureTenants()
        {
            var mtc = new MultitenantContainer(_botIdStrategy, Conversation.Container);

            using (var scope = Conversation.Container.BeginLifetimeScope())
            {
                var botConfigService = scope.Resolve<BotConfigService>();
                var bots = botConfigService.List(_published);
                foreach (var botConfig in bots)
                {
                    mtc.ConfigureTenant(botConfig.Id.ToString(), b =>
                    {
                        var settings = botConfig.ToInstanceSettings();
                        b.Register(ctx => settings).AsSelf();
                        b.RegisterModule(new BotDataStoreModule(settings));
                    });
                }
                botConfigService.RefreshCache(bots);
            }

            var config = GlobalConfiguration.Configuration;
            config.DependencyResolver = new AutofacWebApiDependencyResolver(mtc);
        }

        internal void RemoveTenant(string botId)
        {
            var config = GlobalConfiguration.Configuration;
            var resolver = (AutofacWebApiDependencyResolver)config.DependencyResolver;
            var mtc = (MultitenantContainer)resolver.Container;
            using (var scope = Conversation.Container.BeginLifetimeScope())
            {
                var botConfigService = scope.Resolve<BotConfigService>();
                botConfigService.InvalidateCache(botId);

                mtc.RemoveTenant(botId);
            }
        }

        internal void UpdateTenant(string botId)
        {
            var config = GlobalConfiguration.Configuration;
            var resolver = (AutofacWebApiDependencyResolver)config.DependencyResolver;
            var mtc = (MultitenantContainer)resolver.Container;
            using (var scope = Conversation.Container.BeginLifetimeScope())
            {
                var botConfigService = scope.Resolve<BotConfigService>();
                botConfigService.InvalidateCache(botId);

                mtc.ReconfigureTenant(botId, b =>
                {
                    var botConfig = botConfigService.GetConfig(botId, _published);
                    var settings = botConfig.ToInstanceSettings();
                    b.Register(ctx => settings).AsSelf();

                    b.RegisterModule(new BotDataStoreModule(settings));
                });
            }
        }
    }
}