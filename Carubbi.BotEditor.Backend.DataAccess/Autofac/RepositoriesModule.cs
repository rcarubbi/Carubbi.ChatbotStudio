using Autofac;
using Carubbi.BotEditor.Backend.DataAccess.Repositories;
using Carubbi.BotEditor.Backend.Domain.Repositories;

namespace Carubbi.BotEditor.Backend.DataAccess.Autofac
{
    public class RepositoriesModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<ConnectionManager>()
              .AsSelf()
              .InstancePerLifetimeScope();

            builder.RegisterType<DapperUserRepository>()
                .As<IUserRepository>()
                .InstancePerLifetimeScope();

            builder.RegisterType<DapperPermissionRepository>()
                   .As<IPermissionRepository>()
                   .InstancePerLifetimeScope();

            builder.RegisterType<DapperGroupRepository>()
                   .As<IGroupRepository>()
                   .InstancePerLifetimeScope();

            builder.RegisterType<DapperAppAccessRepository>()
                .As<IAppAccessRepository>()
                .InstancePerLifetimeScope();

            builder.RegisterType<DapperBotRepository>()
                .As<IBotRepository>()
                .InstancePerLifetimeScope();

        }

      
    }
}
