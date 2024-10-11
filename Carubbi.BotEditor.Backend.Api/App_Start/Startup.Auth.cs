using Autofac;
using Carubbi.BotEditor.Backend.Domain.Services;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Owin;
using System;
using System.Configuration;
using System.Linq;

namespace Carubbi.BotEditor.Backend.Api
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        // For more information on configuring authentication, please visit https://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app, IContainer container)
        {
            ConfigureTokenGeneration(app, container);
            ConfigureTokenConsumption(app, container);
        }

        private static void ConfigureTokenConsumption(IAppBuilder app, IContainer container)
        {
            var issuer = ConfigurationManager.AppSettings["BaseUrl"];
            var appAccesses = container.BeginLifetimeScope().Resolve<AppAccessService>().ListAll();
            var audience = appAccesses.Select(x => x.ClientId);
            var secretsSymmetricKey = (from x in appAccesses
                                       select new SymmetricKeyIssuerSecurityKeyProvider(issuer, TextEncodings.Base64Url.Decode(x.SecretKey))).ToArray();

            if (audience.Count() > 0)
                app.UseJwtBearerAuthentication(
                new JwtBearerAuthenticationOptions
                {
                    AuthenticationMode = AuthenticationMode.Active,
                    AllowedAudiences = audience,
                    IssuerSecurityKeyProviders = secretsSymmetricKey
                });
        }

        private static void ConfigureTokenGeneration(IAppBuilder app, IContainer container)
        {
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = container.BeginLifetimeScope().Resolve<IOAuthAuthorizationServerProvider>(),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(14),
                // In production mode set AllowInsecureHttp = false
#if DEBUG
                AllowInsecureHttp = true,
#endif
                AccessTokenFormat = container.BeginLifetimeScope().Resolve<ISecureDataFormat<AuthenticationTicket>>(),
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthAuthorizationServer(OAuthOptions);
        }
    }
}
