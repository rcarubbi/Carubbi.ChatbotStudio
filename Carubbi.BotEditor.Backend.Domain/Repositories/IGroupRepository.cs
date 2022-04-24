using Carubbi.BotEditor.Backend.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Repositories
{
    public interface IGroupRepository
    {
        void Save(Group group);
        Group GetById(int id);
        void Delete(int id);
        ICollection<Group> ListAll();
        void AddPermission(int permissionId, int groupId);
        void RemovePermission(int permissionId, int groupId);
        void AddUser(Guid userId, int groupId);
        void RemoveUser(Guid userId, int groupId);
    }
}
