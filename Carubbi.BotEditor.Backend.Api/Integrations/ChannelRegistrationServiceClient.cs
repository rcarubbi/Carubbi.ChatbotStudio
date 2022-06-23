using Carubbi.BotEditor.Backend.Domain.Integrations;
using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Models.Response;
using RestSharp;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Backend.Api.Integrations
{
    public class ChannelRegistrationServiceClient : IChannelRegistrationServiceClient
    {

        private readonly IRestClient _restClient;

        public ChannelRegistrationServiceClient(IRestClient restClient)
        {
            _restClient = restClient;
        }
         
        private async Task<ChannelRegistrationResponse> MakeRequestAsync(ChannelRegistrationRequest request, Method method)
        {
            if (_restClient.BaseUrl != null)
            {
                var httpRequest = new RestRequest("Observer/Register", method, DataFormat.Json);
                httpRequest.AddHeader("Accept", "application/json");
                httpRequest.AddJsonBody(request);
                IRestResponse<ChannelRegistrationResponse> response = await _restClient.ExecuteTaskAsync<ChannelRegistrationResponse>(httpRequest);
                return response.Data;
            }
            else
            {
                return new ChannelRegistrationResponse
                {
                    Success = false,
                    ErrorMessages = new string[] { "Base url not set for ChannelRegistrationServiceClient" }
                };
            }
        }


        public async Task<ChannelRegistrationResponse> RegisterAsync(ChannelRegistrationRequest request)
        {
            return await MakeRequestAsync(request, Method.POST);
        }

        public async Task<ChannelRegistrationResponse> UnregisterAsync(ChannelRegistrationRequest request)
        {
            return await MakeRequestAsync(request, Method.DELETE);
        }
    }
}