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
    public class DapperPermissionRepository : IPermissionRepository
    {
        private ConnectionManager _connectionManager;
        public DapperPermissionRepository(ConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public IQueryable<Permission> Roles => ListAll().AsQueryable();

        public Task CreateAsync(Permission role)
        {
            throw new NotSupportedException();
        }

        public Task DeleteAsync(Permission role)
        {
            throw new NotSupportedException();
        }

        public void Dispose()
        {
            if (_connectionManager != null)
            {
                _connectionManager.Dispose();
                _connectionManager = null;
            }
        }

        public Task<Permission> FindByIdAsync(int roleId)
        {
            return Task.FromResult(ListAll().SingleOrDefault(p => p.Id == roleId));
        }

        public Task<Permission> FindByNameAsync(string roleName)
        {
            return Task.FromResult(ListAll().SingleOrDefault(p => p.Name == roleName));
        }

        public ICollection<Permission> ListAll()
        {
            return _connectionManager.IdentityServer.Query<Permission>(PermissionQueries.ListAll).ToList();
        }

        public Task UpdateAsync(Permission role)
        {
            throw new NotImplementedException();
        }
    }
}
