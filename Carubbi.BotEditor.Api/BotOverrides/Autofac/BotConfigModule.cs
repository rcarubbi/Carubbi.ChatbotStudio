using Autofac;
using Carubbi.BotEditor.Backend.DataAccess;
using Carubbi.BotEditor.Backend.DataAccess.Cache;
using Carubbi.BotEditor.Backend.DataAccess.Repositories;
using Carubbi.BotEditor.Backend.Domain.Cache;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using Carubbi.BotEditor.Backend.Domain.Services;
using Carubbi.BotEditor.Config;

namespace Carubbi.BotEditor.Backend.Domain.Autofac
{
    public class BotConfigModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<InMemoryBotConfigCache>().As<IBotConfigCache>().SingleInstance(); 
            builder.RegisterType<BotConfigService>().AsSelf().SingleInstance();
            builder.RegisterType<BotService>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<DapperBotRepository>().As<IBotRepository>().InstancePerLifetimeScope();
            builder.RegisterType<ConnectionManager>().AsSelf().InstancePerLifetimeScope();
            builder.RegisterType<BotInstanceSettings>().AsSelf().InstancePerLifetimeScope();
        }
    }
}
