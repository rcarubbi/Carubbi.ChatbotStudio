using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net;

namespace Carubbi.BotEditor.FormsIntegration
{
    public static class OptionsSourceClient
    {
        public static List<FieldOption> GetOptions(string url, object state, BotConfig botConfig)
        {
            using (var client = new WebClient())
            {
                client.Encoding = System.Text.Encoding.UTF8;
                var json = $@"{{
                        ""botConfig"": {JsonConvert.SerializeObject(botConfig)},        
                        ""state"": {JsonConvert.SerializeObject(state)} }}";
                client.Headers[HttpRequestHeader.ContentType] = "application/json";
                client.Headers[HttpRequestHeader.Accept] = "application/json";
                string result = client.UploadString(url, json);
                return JsonConvert.DeserializeObject<List<FieldOption>>(result);
            }
        }
    }
}
