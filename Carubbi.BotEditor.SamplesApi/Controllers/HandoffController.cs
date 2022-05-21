using Carubbi.BotEditor.Config;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class HandoffController : ApiController
    {
        public static List<string> messages = new List<string>();
        public async Task<HttpResponseMessage>  Post([FromBody]Activity activity)
        {
            try
            {
                var config = JsonConvert.DeserializeObject<BotConfig>(activity.ChannelData.ToString());
                var reply = activity.CreateReply();
                if (activity.Text.Equals("tchau"))
                {
                    reply.ChannelData = JsonConvert.SerializeObject(new { Status = "Resolvido" });
                    reply.Text = "Obrigado";
                    reply.Type = "EndHandoff";
                }
                else if (activity.Type == "ConversationStarted")
                {
                    reply.Type = ActivityTypes.Handoff;
                    reply.Text = $"Olá eu sou o operador Humano e vou te ajudar com o seu atendimento no bot {config.Name}";
                    using (var client = new HttpClient())
                    {
                        var response = await client.PostAsJsonAsync($"http://localhost:3979/bot/{config.Name}", reply);
                    }

                    reply.Type = ActivityTypes.Handoff;
                    reply.Text = $"Como posso te ajudar?";
                }
                else
                {
                    reply.Type = ActivityTypes.Handoff;
                    reply.Text = $"Echo para o bot {config.Name}: {activity.Text}";

                }

                using (var client = new HttpClient())
                {
                    // TODO: Tratar autenticação
                    var response = await client.PostAsJsonAsync($"http://localhost:3979/bot/{config.Name}", reply);

                }

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
            
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}