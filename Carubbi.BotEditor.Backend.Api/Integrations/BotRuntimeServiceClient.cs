using Carubbi.BotEditor.Backend.Domain.Integrations;
using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Models.Response;
using RestSharp;

namespace Carubbi.BotEditor.Backend.Api.Integrations
{
    public class BotRuntimeServiceClient : IBotRuntimeServiceClient
    {
        private readonly IRestClient _restClient;

        public BotRuntimeServiceClient(IRestClient restClient)
        {
            _restClient = restClient;
        }

        public BotRuntimeResponse Create(BotRuntimeRequest request)
        {
            return MakeRequest(request, Method.POST);
        }

        public BotRuntimeResponse Update(BotRuntimeRequest request)
        {
            return MakeRequest(request, Method.PUT);
        }

        public BotRuntimeResponse Delete(BotRuntimeRequest request)
        {
            return MakeRequest(request, Method.DELETE);
        }

        private BotRuntimeResponse MakeRequest(BotRuntimeRequest request, Method method)
        {
            if (_restClient.BaseUrl != null)
            {
                var httpRequest = new RestRequest("BotRuntime", method, DataFormat.Json);
                httpRequest.AddHeader("Accept", "application/json");
                httpRequest.AddJsonBody(request);
                IRestResponse<BotRuntimeResponse> response = _restClient.Execute<BotRuntimeResponse>(httpRequest);
                return response.Data;
            }
            else
            {
                return new BotRuntimeResponse
                {
                    FormStepResults = new System.Collections.Generic.List<FormStepResult>
                    {
                        new FormStepResult(0, true, new string[] { })
                    }
                };
            }
        }
    }
}