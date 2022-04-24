using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Carubbi.BotEditor.Backend.Api.Controllers
{

    public class GroupController : BaseApiController
    {

        private IGroupRepository _repository;

        public GroupController(IGroupRepository repository)
        {
            _repository = repository;
        }

        [Authorize(Roles = "Listar Grupos de Acesso")]
        public IEnumerable<Group> Get()
        {
            return _repository.ListAll();
        }

        [Authorize(Roles = "Listar Grupos de Acesso")]
        public IHttpActionResult Get(int id)
        {
            return Ok(_repository.GetById(id));
        }

        [Authorize(Roles = "Criar/Alterar Grupos de Acesso")]
        public IHttpActionResult Post(Group group)
        {
            try
            {
                _repository.Save(group);
                return CreatedAtRoute("DefaultApi", new { id = group.Id }, group);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Criar/Alterar Grupos de Acesso")]
        public IHttpActionResult Put(Group grupo)
        {
            try
            {
                _repository.Save(grupo);
                return Ok(grupo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Criar/Alterar Grupos de Acesso")]
        public IHttpActionResult Delete(int id)
        {
            try
            {
                _repository.Delete(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Criar/Alterar Grupos de Acesso")]
        [HttpPost]
        public IHttpActionResult AddUser([FromBody] int groupId, [FromBody] Guid userId)
        {
            var group = _repository.GetById(groupId);
            if (!group.Users.Any(u => u.Id == userId))
            {
                _repository.AddUser(userId, groupId);
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(Roles = "Criar/Alterar Grupos de Acesso")]
        [HttpPost]
        public IHttpActionResult RemoveUser([FromBody] int groupId, [FromBody] Guid userId)
        {
            var group = _repository.GetById(groupId);
            if (group.Users.Any(u => u.Id == userId))
            {
                _repository.RemoveUser(userId, groupId);
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(Roles = "Criar/Alterar Grupos de Acesso")]
        [HttpPost]
        public IHttpActionResult AddPermission([FromBody] int groupId, [FromBody] int permissionId)
        {
            var group = _repository.GetById(groupId);
            if (!group.Permissions.Any(p => p.Id == permissionId))
            {
                _repository.AddPermission(permissionId, groupId);
                return Ok();
            }

            return BadRequest();
        }

        [Authorize(Roles = "Criar/Alterar Grupos de Acesso")]
        [HttpPost]
        public IHttpActionResult RemovePermission([FromBody] int groupId, [FromBody] int permissionId)
        {
            var grupo = _repository.GetById(groupId);
            if (grupo.Permissions.Any(p => p.Id == permissionId))
            {
                _repository.RemovePermission(permissionId, groupId);
                return Ok();
            }

            return BadRequest();

        }
    }
}