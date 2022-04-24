using Dapper;
using Carubbi.BotEditor.Backend.DataAccess.Queries;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Backend.DataAccess.Repositories
{
    public class DapperUserRepository : IUserRepository
    {
        public DapperUserRepository(ConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        private ConnectionManager _connectionManager;

        public IQueryable<User> Users => ListAll().AsQueryable();

        public Task AddToRoleAsync(User user, string roleName)
        {
            throw new NotSupportedException();
        }

        public Task CreateAsync(User user)
        {
            Save(user);
            return Task.FromResult<object>(null);
        }

        public void Delete(Guid id)
        {
            _connectionManager.IdentityServer.Execute(UserQueries.Delete, new { id });
        }

        public Task DeleteAsync(User user)
        {
            Delete(user.Id);
            return Task.FromResult<object>(null);
        }

        public void Dispose()
        {
            if (_connectionManager != null)
            {
                _connectionManager.Dispose();
                _connectionManager = null;
            }
        }

        public Task<User> FindByIdAsync(Guid userId)
        {
            return Task.FromResult(GetById(userId));
        }

        public Task<User> FindByNameAsync(string userName)
        {
            return Task.FromResult(GetByUsername(userName));
        }

        public Task<int> GetAccessFailedCountAsync(User user)
        {
            return Task.FromResult(user.AccessFailedCount);
        }

        public User GetByUsername(string username)
        {
            var user = _connectionManager.IdentityServer.Query<User>(UserQueries.GetByUsername, new { username }).SingleOrDefault();
            if (user != null) user = GetById(user.Id);
            return user;
        }

        public User GetByEmail(string email)
        {
            var user = _connectionManager.IdentityServer.Query<User>(UserQueries.GetByEmail, new { email }).SingleOrDefault();
            if (user != null) user = GetById(user.Id);
            return user;
        }

        public User GetById(Guid id)
        {
            var queryResults = _connectionManager.IdentityServer.QueryMultiple(
                $"{UserQueries.GetById};{UserQueries.ListGroupsPerUser};{UserQueries.ListPermissionsPerUser}", new { id });
            var user = queryResults.Read<User>().SingleOrDefault();

            if (user != null)
            {
                var groups = queryResults.Read<Group>().ToList();
                user.Groups.AddRange(groups);
                var permissions = queryResults.Read<PermissionPerGroup>();
                var permissionsPerGroup = permissions.GroupBy(x => x.GroupId);
                foreach (var item in permissionsPerGroup)
                    user.Groups.Single(x => x.Id == item.Key).Permissions = item
                        .ToList()
                        .ConvertAll(x => new Permission(x.PermissionId, x.PermissionName));
            }

            return user;
        }

        public Task<bool> GetLockoutEnabledAsync(User user)
        {
            return Task.FromResult(user.BlockEnabled);
        }

        public Task<DateTimeOffset> GetLockoutEndDateAsync(User user)
        {
            return
               Task.FromResult(user.LockoutEndDate.HasValue
                   ? new DateTimeOffset(DateTime.SpecifyKind(user.LockoutEndDate.Value, DateTimeKind.Utc))
                   : new DateTimeOffset());
        }

        public Task<string> GetPasswordHashAsync(User user)
        {
            return Task.FromResult(user.Password);
        }

        public Task<IList<string>> GetRolesAsync(User user)
        {
            var permissionNames = user.Groups
                 .Where(g => g.Active)
                 .SelectMany(g => g.Permissions)
                 .Select(p => p.Name).ToList();

            return Task.FromResult<IList<string>>(permissionNames);
        }

        public Task<bool> GetTwoFactorEnabledAsync(User user)
        {
            return Task.FromResult(user.TwoFactorEnabled);
        }

        public Task<bool> HasPasswordAsync(User user)
        {
            return Task.FromResult(!string.IsNullOrEmpty(user.Password));
        }

        public Task<int> IncrementAccessFailedCountAsync(User user)
        {
            user.AccessFailedCount++;
            Save(user);
            return Task.FromResult(user.AccessFailedCount);
        }

        public Task<bool> IsInRoleAsync(User user, string roleName)
        {
            return Task.FromResult(GetRolesAsync(user).Result.Contains(roleName));
        }

        public ICollection<User> ListAll()
        {
            return _connectionManager.IdentityServer.Query<User>(UserQueries.ListAll).ToList();
        }

        public Task RemoveFromRoleAsync(User user, string roleName)
        {
            throw new NotSupportedException(); 
        }

        public Task ResetAccessFailedCountAsync(User user)
        {
            user.AccessFailedCount = 0;
            Save(user);
            return Task.FromResult(user.AccessFailedCount);
        }

        public void Save(User user)
        {
            if (user.Id == Guid.Empty)
            {
                var guid = _connectionManager.IdentityServer.Query<Guid>(UserQueries.Insert, user).Single();
                user.Id = guid;
            }
            else
            {
                _connectionManager.IdentityServer.Execute(UserQueries.Update, user);
            }
        }

        public Task SetLockoutEnabledAsync(User user, bool enabled)
        {
            user.BlockEnabled = enabled;
            Save(user);
            return Task.FromResult(0);
        }

        public Task SetLockoutEndDateAsync(User user, DateTimeOffset lockoutEnd)
        {
            user.LockoutEndDate = lockoutEnd.UtcDateTime;
            Save(user);
            return Task.FromResult(0);
        }

        public Task SetPasswordHashAsync(User user, string passwordHash)
        {
            user.Password = passwordHash;
            Save(user);
            return Task.FromResult<object>(null);
        }

        public Task SetTwoFactorEnabledAsync(User user, bool enabled)
        {
            user.TwoFactorEnabled = enabled;
            Save(user);
            return Task.FromResult(0);
        }

        public Task UpdateAsync(User user)
        {
            Save(user);
            return Task.FromResult<object>(null);
        }

        public Task SetEmailAsync(User user, string email)
        {
            user.Email = email;
            Save(user);
            return Task.FromResult(0);
        }

        public Task<string> GetEmailAsync(User user)
        {
            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(User user)
        {
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailConfirmedAsync(User user, bool confirmed)
        {
            user.EmailConfirmed = confirmed;
            Save(user);
            return Task.FromResult(0);
        }

        public Task<User> FindByEmailAsync(string email)
        {
            return Task.FromResult(GetByEmail(email));
        }
    }
}
