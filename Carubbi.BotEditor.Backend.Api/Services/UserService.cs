using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using Microsoft.AspNet.Identity;
using System;

namespace Carubbi.BotEditor.Backend.Api.Services
{
    public class UserService : UserManager<User, Guid>
    {
        public UserService(IUserRepository repo, 
            IIdentityMessageService identityMessageService, 
            IUserTokenProvider<User, Guid> userTokenProvider) : base(repo)
        {
            UserValidator = new UserValidator<User, Guid>(this)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configure validation logic for passwords
            PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6,
                RequireNonLetterOrDigit = false,
                RequireDigit = false,
                RequireLowercase = false,
                RequireUppercase = false
            };

            // Configure AppMember lockout defaults
            UserLockoutEnabledByDefault = false;
            DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            MaxFailedAccessAttemptsBeforeLockout = 5;

            // Register two factor authentication providers. This application uses Phone and Emails as a step of receiving a code for verifying the AppMember
            // You can write your own provider and plug it in here.
            RegisterTwoFactorProvider("Codigo por E-mail", new EmailTokenProvider<User, Guid>
            {
                Subject = "Código de acesso",
                BodyFormat = "Seu código de acesso é {0}"
            });

            EmailService = identityMessageService;
            UserTokenProvider = userTokenProvider;
        }
    }
}