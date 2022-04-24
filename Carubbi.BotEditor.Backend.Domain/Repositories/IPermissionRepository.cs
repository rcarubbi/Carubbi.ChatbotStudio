using Carubbi.BotEditor.Backend.Domain.Entities;
using Microsoft.AspNet.Identity;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Repositories
{
    public interface IPermissionRepository : IQueryableRoleStore<Permission, int>
    {
        ICollection<Permission> ListAll();
    }
}
