using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.FormsIntegration
{
    public static class Validator
    {

        public static ValidationResponse ValidationApi(string url, object state, object value, BotConfig botConfig)
        {
            using (var client = new WebClient())
            {
                client.Encoding = System.Text.Encoding.UTF8;
                var json = $@"{{ 
                                 ""botConfig"": {JsonConvert.SerializeObject(botConfig)},
                                 ""state"": {JsonConvert.SerializeObject(state)},
                                 ""value"": {JsonConvert.SerializeObject(value)} }}";

                client.Headers[HttpRequestHeader.ContentType] = "application/json";
                client.Headers[HttpRequestHeader.Accept] = "application/json";
                string result = client.UploadString(url, json);
                return JsonConvert.DeserializeObject<ValidationResponse>(result);
            }
        }

        public static bool ActiveApi(string url, object state, BotConfig botConfig)
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
                return JsonConvert.DeserializeObject<bool>(result);
            }
        }

        public static bool CPF(string cpf)
        {
            if (cpf.Length != 11)
            {
                return false;
            }

            var blackList = new string[] {
                    "11111111111",
                    "22222222222",
                    "33333333333",
                    "44444444444",
                    "55555555555",
                    "66666666666",
                    "77777777777",
                    "88888888888",
                    "99999999999",
                    "00000000000"
                    };

            if (blackList.Any(x => x == cpf))
                return false;

            string digitosSemDV = cpf.Substring(0, 9);
            string dv1, dv2;

            int multiplicadorDV1 = 10;
            int acumuladorDV1 = 0;
            foreach (char digito in digitosSemDV)
            {
                acumuladorDV1 += (int)char.GetNumericValue(digito) * multiplicadorDV1--;
            }

            var modDV1 = acumuladorDV1 % 11;

            if (modDV1 < 2)
                dv1 = "0";
            else
                dv1 = Convert.ToString(11 - modDV1);


            int multiplicadorDV2 = 11;
            int acumuladorDV2 = 0;
            string digitosComDv1 = digitosSemDV + dv1;
            foreach (var digito in digitosComDv1)
            {
                acumuladorDV2 += (int)char.GetNumericValue(digito) * multiplicadorDV2--;
            }

            var modDv2 = acumuladorDV2 % 11;
            if (modDv2 < 2)
            {
                dv2 = "0";
            }
            else
            {
                dv2 = Convert.ToString(11 - modDv2);
            }
            string cpfEsperado = digitosComDv1 + dv2;
            return cpf == cpfEsperado;
        }
    }
}
