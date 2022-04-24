using Carubbi.BotEditor.Backend.Domain.Entities;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Repositories
{
    public interface IUserRepository : IUserRoleStore<User, Guid>,
        IUserPasswordStore<User, Guid>,
        IQueryableUserStore<User, Guid>,
        IUserStore<User, Guid>,
        IUserLockoutStore<User, Guid>,
        IUserTwoFactorStore<User, Guid>,
        IUserEmailStore<User, Guid>
    {
        ICollection<User> ListAll();
        User GetById(Guid id);

        void Save(User user);
        void Delete(Guid id);

        User GetByUsername(string username);

        User GetByEmail(string email);

    }
}
