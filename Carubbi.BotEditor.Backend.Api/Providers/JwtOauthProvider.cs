using Carubbi.BotEditor.Backend.Api.Services;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Services;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Backend.Api.Providers
{
    public class JwtOauthProvider : OAuthAuthorizationServerProvider
    {
        private readonly UserService _userService;
        private readonly AppAccessService _appAccessService;

        public JwtOauthProvider(UserService userService, AppAccessService appAccessService)
        {
            _userService = userService;
            _appAccessService = appAccessService;
        }

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            string clientId = string.Empty;
            string clientSecret = string.Empty;
            string symmetricKeyAsBase64 = string.Empty;
            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }
            if (context.ClientId == null)
            {
                context.SetError("invalid_clientId", "client_Id não pode ser nulo");
                return Task.FromResult<object>(null);
            }

            var token = context.ClientId.Split(':');
            var client_id = token.First();
            var accessKey = token.Last();
            var applicationAccess = _appAccessService.Find(client_id);

            if (applicationAccess == null)
            {
                context.SetError("invalid_clientId", "client_Id não encontrado");
                return Task.FromResult<object>(null);
            }
            if (applicationAccess.AccessKey != accessKey)
            {
                context.SetError("invalid_clientId", "access key não encontrado ou inválido");
                return Task.FromResult<object>(null);
            }

            context.Validated();
            return Task.FromResult<object>(null);

        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var user = await _userService.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("invalid_grant", "Usuário ou senha invalidos");
                return;
            }

            var identity = new ClaimsIdentity("JWT");
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            identity.AddClaim(new Claim("sub", context.UserName));
             

            LoadRoles(user, identity);

            var props = new AuthenticationProperties(new Dictionary<string, string> {
                    {
                         "audience", (context.ClientId == null) ? string.Empty : context.ClientId
                    }
            });

            var ticket = new AuthenticationTicket(identity, props);
            context.Validated(ticket);
        }

        private void LoadRoles(User user, ClaimsIdentity identity)
        {
            var roleNames = user.Groups.SelectMany(x => x.Permissions).Select(x => x.Name).Distinct();
            foreach (var roleName in roleNames) identity.AddClaim(new Claim(ClaimTypes.Role, roleName));
        }
    }
}