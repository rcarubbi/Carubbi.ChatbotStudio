using Carubbi.BotEditor.SamplesApi.Models;
using System.Threading.Tasks;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class ShowroomListarFaturasController : ApiController
    {
        public async Task<ShowroomListarFaturasResponse> Post([FromBody] string cpf)
        {
            await Task.Delay(2000);
            return new ShowroomListarFaturasResponse
            {
                QtdFaturas = 2,
                LinkFatura = "https://expoforest.com.br/wp-content/uploads/2017/05/exemplo.pdf",
                ValorTotal = 1071.15M
            };
        }
    }
}