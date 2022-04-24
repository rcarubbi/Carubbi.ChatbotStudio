using Carubbi.BotEditor.Backend.Api.Services;
using Carubbi.BotEditor.Backend.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Carubbi.BotEditor.Backend.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/Account")]
    public class AccountController : BaseApiController
    {
        private readonly UserService _userService;

        public AccountController(UserService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Listar Usuários")]
        // GET api/Usuario
        public IEnumerable<User> Get()
        {
            return _userService.Users;
        }

        public IHttpActionResult Get(Guid id)
        {
            var user = _userService.FindByIdAsync(id).Result;
            if (LoggedUser == user.UserName || Permissions.Contains("Listar Usuários"))
                return Ok(user);
            return Unauthorized();
        }

        [AllowAnonymous]
        public IHttpActionResult Post(User user)
        {
            user.Password = _userService.PasswordHasher.HashPassword(user.Password);
            var createResult = _userService.CreateAsync(user).Result;
            if (createResult.Succeeded)
                return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
            return BadRequest(string.Join(";", createResult.Errors));
        }

        [ActionName("AlterarSenha")]
        public IHttpActionResult ChangePassword(Guid id, [FromBody] string currentPassword, [FromBody] string newPassword)
        {
            var user = _userService.FindByIdAsync(id).Result;
            if (LoggedUser == user.UserName)
            {
                var taskResult = _userService.ChangePasswordAsync(id,
                    _userService.PasswordHasher.HashPassword(currentPassword),
                    _userService.PasswordHasher.HashPassword(newPassword)).Result;

                if (taskResult.Succeeded)
                    return Ok();
                return BadRequest(string.Join(";", taskResult.Errors));
            }

            return Unauthorized();
        }

        [Authorize(Roles = "Alterar Usuários")]
        public IHttpActionResult Put(Guid id, User updatedUser)
        {
            var user = _userService.FindByIdAsync(id).Result;
            if (LoggedUser == user.UserName || Permissions.Contains("Alterar Usuários"))
            {
                var taskResult = _userService.UpdateAsync(updatedUser).Result;
                if (taskResult.Succeeded)
                    return Ok();
                return BadRequest(string.Join(";", taskResult.Errors));
            }

            return Unauthorized();
        }

        [Authorize(Roles = "Alterar Usuários")]
        // DELETE api/Usuario/5
        public IHttpActionResult Delete(Guid id)
        {
            var taskResult = _userService.FindByIdAsync(id).ContinueWith(
            task => _userService.DeleteAsync(task.Result)).Result.Result;

            if (taskResult.Succeeded)
                return Ok();
            return BadRequest(string.Join(";", taskResult.Errors));
        }
    }
}
