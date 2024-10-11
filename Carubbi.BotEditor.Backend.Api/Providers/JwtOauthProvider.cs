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
            if (!context.TryGetBasicCredentials(out _, out _))
            {
                 context.TryGetFormCredentials(out _, out _);
            }

            if (context.ClientId == null)
            {
                context.SetError("invalid_clientId", "client_Id cannot be null");
                return Task.CompletedTask;
            }

            var token = context.ClientId.Split(':');
            var client_id = token.First();
            var accessKey = token.Last();
            var applicationAccess = _appAccessService.Find(client_id);

            if (applicationAccess == null)
            {
                context.SetError("invalid_clientId", "client_Id not found");
                return Task.CompletedTask;
            }
            if (applicationAccess.AccessKey != accessKey)
            {
                context.SetError("invalid_clientId", "access key invalid or not found");
                return Task.CompletedTask;
            }

            context.Validated();
            return Task.CompletedTask;
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var user = await _userService.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("invalid_grant", "Invalid user or passord");
                return;
            }

            var identity = new ClaimsIdentity("JWT");
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            identity.AddClaim(new Claim("sub", context.UserName));
             

            LoadRoles(user, identity);

            var props = new AuthenticationProperties(new Dictionary<string, string> {
                    {
                         "audience", context.ClientId ?? string.Empty
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