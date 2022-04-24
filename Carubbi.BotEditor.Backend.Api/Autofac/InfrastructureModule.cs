using Autofac;
using Carubbi.BotEditor.Backend.Api.Providers;
using Carubbi.BotEditor.Backend.Api.Services;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Services;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataProtection;
using System;
using System.Configuration;
using System.Web;

namespace Carubbi.BotEditor.Backend.Api.Autofac
{
    public class InfrastructureModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(c => new DpapiDataProtectionProvider("Carubbi.BotEditor"))
             .As<IDataProtectionProvider>();

            builder.Register(c => new DataProtectorTokenProvider<User, Guid>(c.Resolve<IDataProtectionProvider>().Create("Autenticação Carubbi.BotEditor")))
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();


            builder.Register(c =>
                new JwtFormat(
                    ConfigurationManager.AppSettings["BaseUrl"],
                    c.Resolve<AppAccessService>()
                )
            )
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();

            builder.Register(c =>
                new JwtOauthProvider(
                    c.Resolve<UserService>(),
                    c.Resolve<AppAccessService>()
                )
            )
                .AsImplementedInterfaces()
                .InstancePerLifetimeScope();


            builder.Register(c => HttpContext.Current.GetOwinContext().Authentication)
                .As<IAuthenticationManager>();
        }
    }
}