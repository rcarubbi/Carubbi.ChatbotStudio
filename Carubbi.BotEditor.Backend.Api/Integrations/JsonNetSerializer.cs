using Newtonsoft.Json;
using RestSharp;
using RestSharp.Serialization;

namespace Carubbi.BotEditor.Backend.Api.Integrations
{
    public class JsonNetSerializer : IRestSerializer
    {
         
     
        public string Serialize(object obj) =>
                 JsonConvert.SerializeObject(obj);

        public string Serialize(Parameter bodyParameter) =>
            JsonConvert.SerializeObject(bodyParameter.Value);

        public T Deserialize<T>(IRestResponse response) =>
            JsonConvert.DeserializeObject<T>(response.Content);

        public string[] SupportedContentTypes { get; } =
        {
                "application/json", "text/json", "text/x-json", "text/javascript", "*+json"
            };

        public string ContentType { get; set; } = "application/json";

        public DataFormat DataFormat { get; } = DataFormat.Json;
    }
}