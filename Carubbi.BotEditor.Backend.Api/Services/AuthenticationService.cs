using Carubbi.BotEditor.Backend.Domain.Entities;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using System;

namespace Carubbi.BotEditor.Backend.Api.Services
{
    public class AuthenticationService : SignInManager<User, Guid>
    {

        public AuthenticationService(UserService userService, IAuthenticationManager authenticationManager)
            : base(userService, authenticationManager)
        {
        }

    }
}