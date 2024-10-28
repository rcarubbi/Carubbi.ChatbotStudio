using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using System.Collections.Generic;
using System.Web.Http;

namespace Carubbi.BotEditor.Backend.Api.Controllers
{
    public class PermissionController : BaseApiController
    {
        private IPermissionRepository _repository;

        public PermissionController(IPermissionRepository repository)
        {
            _repository = repository;
        }

        [Authorize(Roles = "List Permissions")]
        public IEnumerable<Permission> Get()
        {
            return _repository.Roles;
        }
    }
}