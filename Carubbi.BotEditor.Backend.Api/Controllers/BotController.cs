using Carubbi.BotEditor.Backend.Api.Services;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Services;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Carubbi.BotEditor.Backend.Api.Controllers
{
    [Authorize]
    public class BotController : BaseApiController
    {
        private readonly BotService _botService;
        private readonly UserService _userService;

        public BotController(BotService botService, UserService userService)
        {
            _botService = botService;
            _userService = userService;
        }

        [Authorize(Roles = "Listar Bots")]
        // GET api/Usuario
        public IEnumerable<Bot> Get()
        {
            return _botService.ListAll();
        }

        [Authorize(Roles = "Criar/Alterar Bots,Listar Bots")]
        public Bot Get(Guid id)
        {
            return _botService.GetById(id);
        }

        [Authorize(Roles = "Criar/Alterar Bots")]
        public async Task<IHttpActionResult> Put(BotRequest request)
        {
            var user = await _userService.FindByNameAsync(LoggedUser);
            _botService.Update(request, user);

            return Ok(request.Id);
        }

        [Authorize(Roles = "Criar/Alterar Bots")]
        public async Task<IHttpActionResult> Post(BotRequest request)
        {
            try
            {
                var user = await _userService.FindByNameAsync(LoggedUser);
                var bot = _botService.Create(request, user);
                var route = $"{Request.GetRequestContext().VirtualPathRoot}/api/bot/{bot.Id}";
                return Created(route, bot);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }

        }

        [Authorize(Roles = "Criar/Alterar Bots")]
        [Route("api/bot/deactivate")]
        [HttpPatch]
        public async Task<IHttpActionResult> Deactivate(BotRequest request)
        {
            var user = await _userService.FindByNameAsync(LoggedUser);
            await _botService.DeactivateAsync(request.Id, user);

            return Ok();
        }

        [Authorize(Roles = "Criar/Alterar Bots")]
        [Route("api/bot/publish")]
        [HttpPatch]
        public async Task<IHttpActionResult> Publish(BotRequest request)
        {
            var user = await _userService.FindByNameAsync(LoggedUser);
            await _botService.PublishAsync(request.Id, user);
            return Ok();
        }
    }
}