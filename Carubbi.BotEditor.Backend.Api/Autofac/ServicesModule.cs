using Autofac;
using Carubbi.BotEditor.Backend.Api.Integrations;
using Carubbi.BotEditor.Backend.Api.Services;
using Carubbi.BotEditor.Backend.Domain.Integrations;
using Carubbi.BotEditor.Backend.Domain.Services;
using Microsoft.AspNet.Identity;
using RestSharp;
using System.Configuration;

namespace Carubbi.BotEditor.Backend.Api.Autofac
{
    public class ServicesModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<NotificationService>()
            .As<IIdentityMessageService>()
            .InstancePerLifetimeScope();

            builder.RegisterType<UserService>()
                .AsSelf()
                .InstancePerLifetimeScope();

            builder.RegisterType<AppAccessService>()
                .AsSelf()
                .InstancePerLifetimeScope();

            builder.RegisterType<BotService>()
                .AsSelf()
                .InstancePerLifetimeScope();

            builder.RegisterInstance(
                CreateRestClient("DevEngineBaseUrl")
            )
               .Keyed<IRestClient>("dev")
               .SingleInstance();

            builder.RegisterInstance(
                CreateRestClient("ProdEngineBaseUrl")
            )
               .Keyed<IRestClient>("prod")
               .SingleInstance();

            builder.Register(ctx => new BotRuntimeServiceClient(ctx.ResolveKeyed<IRestClient>("dev")))
                .Named<IBotRuntimeServiceClient>("devBotRuntimeServiceClient")
                .InstancePerLifetimeScope();

            builder.Register(ctx => new BotRuntimeServiceClient(ctx.ResolveKeyed<IRestClient>("prod")))
                .Named<IBotRuntimeServiceClient>("prodBotRuntimeServiceClient")
                .InstancePerLifetimeScope();


        }

        private static IRestClient CreateRestClient(string baseUrlAppSettingsKey)
        {
            var restClient = (string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings[baseUrlAppSettingsKey])
                            ? new RestClient()
                            : new RestClient(ConfigurationManager.AppSettings[baseUrlAppSettingsKey]))
                           .UseSerializer(() => new JsonNetSerializer());
            restClient.RemoteCertificateValidationCallback = (sender, certificate, chain, sslPolicyErrors) => true;
            return restClient;
        }
    }
}