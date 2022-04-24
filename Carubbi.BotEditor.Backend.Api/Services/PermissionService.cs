using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using Microsoft.AspNet.Identity;

namespace Carubbi.BotEditor.Backend.Api.Services
{
    public class PermissionService : RoleManager<Permission, int>
    {
        public PermissionService(IPermissionRepository repo)
            : base(repo)
        {
        }
    }
}