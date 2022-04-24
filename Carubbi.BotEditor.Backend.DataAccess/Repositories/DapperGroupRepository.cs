using Dapper;
using Carubbi.BotEditor.Backend.DataAccess.Queries;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Backend.DataAccess.Repositories
{
    public class DapperGroupRepository : IGroupRepository
    {
        private readonly ConnectionManager _connectionManager;
        public DapperGroupRepository(ConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }
        public void AddPermission(int permissionId, int groupId)
        {
            _connectionManager.IdentityServer
                  .Execute(GroupQueries.AddPermission,
                      new
                      {
                          permissionId,
                          groupId
                      });
        }

        public void AddUser(Guid userId, int groupId)
        {
            _connectionManager.IdentityServer
                 .Execute(GroupQueries.AddUser,
                     new
                     {
                         userId,
                         groupId
                     });
        }

        public void Delete(int id)
        {
            _connectionManager.IdentityServer.Execute($"{GroupQueries.ClearUsers};{GroupQueries.ClearPermissions};{GroupQueries.Delete}", new { id });
        }

        public Group GetById(int id)
        {
            var queryResults = _connectionManager.IdentityServer.QueryMultiple(
                     $"{GroupQueries.GetById};{GroupQueries.ListUsersPerGroup};{GroupQueries.ListPermissionsPerGroup}", new { id });
            var group = queryResults.Read<Group>().SingleOrDefault();
            if (group != null)
            {
                group.Users.AddRange(queryResults.Read<User>().ToList());
                group.Permissions.AddRange(queryResults.Read<Permission>().ToList());
            }

            return group;
        }

        public ICollection<Group> ListAll()
        {
            return _connectionManager.IdentityServer.Query<Group>(GroupQueries.ListAll).ToList();
        }

       

        public void RemovePermission(int permissionId, int groupId)
        {
            _connectionManager.IdentityServer
               .Execute(GroupQueries.RemovePermission,
                   new
                   {
                       permissionId,
                       groupId
                   });
        }

        public void RemoveUser(Guid userId, int groupId)
        {
            _connectionManager.IdentityServer
            .Execute(GroupQueries.RemoveUser,
                new
                {
                    userId,
                    groupId
                });
        }

        public void Save(Group group)
        {
            if (group.Id == default)
            {
                var id = _connectionManager.IdentityServer.Query<int>(GroupQueries.Insert, group).Single();
                group.Id = id;
            }
            else
            {
                _connectionManager.IdentityServer.Execute(GroupQueries.Update, group);
            }
        }
    }
}
