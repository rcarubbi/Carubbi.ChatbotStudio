using Carubbi.BotEditor.Backend.Domain.Entities;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Backend.Api.Services
{
    public static class UserExtensions
    {
        public static async Task<ClaimsIdentity> GenerateUserIdentityAsync(this User user, UserService userService, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await userService.CreateIdentityAsync(user, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }
}