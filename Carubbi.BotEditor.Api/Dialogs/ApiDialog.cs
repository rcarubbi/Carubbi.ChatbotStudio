using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Builder.Dialogs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class ApiDialog : BaseDialog<object, ApiStep>
    {
        public ApiDialog(BotConfig botConfig, CompositeStep parentStep, ApiStep step)
          : base(botConfig, parentStep, step)
        {
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
             
            var apiUrl = _expressionEvaluator.PrepareMessage(_step.Id, _step.ApiURL);
            var resource = _expressionEvaluator.PrepareMessage(_step.Id, _step.Resource);
            var client = new RestClient(apiUrl);
            var request = new RestRequest(resource, ParseVerb(_step.Verb));

            foreach (var parameter in _step.Parameters)
            {
                if (parameter.Type == ParameterTypes.JsonObject)
                {
                    if (DataSource != null)
                    {
                        foreach (var item in DataSource)
                        {
                            AddJsonParameter(request, parameter, item);
                        }
                    }
                    else
                    {
                        AddJsonParameter(request, parameter, null);
                    }
                }
                else
                {
                    if (DataSource != null)
                    {
                        foreach (var item in DataSource)
                        {
                            AddParameter(request, parameter, item);
                        }
                    }
                    else
                    {
                        AddParameter(request, parameter, null);
                    }
                }
            }


            var loadingMessage = await CreateActivityWithMessage(context, _step.LoadingMessage, string.Empty);
             
            if (!string.IsNullOrEmpty(loadingMessage.Text)) _ = context.PostAsync(loadingMessage);
            
            var response = await client.ExecuteTaskAsync(request);
            var content = response.Content;

            try
            {
                _step.Output = JsonConvert.DeserializeObject($"{{ 'data':{response.Content} }}");
            }
            catch
            {
                _step.Output = response.Content;
            }

            PersistOutput(context, _step.Output);

            if (_step.NextStepId.HasValue)
            {
                var nextStep = GetStep(_step.NextStepId.Value);
                var dialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                context.Call(dialog, GoBack);
            }
            else
            {
                context.Done<object>(null);
            }


        }

        private static Task DoNothing()
        {
            return Task.Run(() => { });
        }

        private void AddParameter(RestRequest request, ApiParameter parameter, object item)
        {
            var evaluatedValue = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, parameter.Value), item).ToString();
            switch (parameter.Type)
            {
                case ParameterTypes.UrlSegment:
                    request.AddUrlSegment(parameter.Name, evaluatedValue);
                    break;
                case ParameterTypes.Header:
                    request.AddHeader(parameter.Name, evaluatedValue);
                    break;
                case ParameterTypes.File:
                    request.AddFile(parameter.Name, evaluatedValue);
                    break;
                default:
                    request.AddParameter(parameter.Name, evaluatedValue);
                    break;
            }
        }

        private void AddJsonParameter(RestRequest request, ApiParameter parameter, object item)
        {
            string jsonString = parameter.Value;
            JObject jsonObj = (JObject)JsonConvert.DeserializeObject(jsonString);
            foreach (var x in jsonObj)
            {
                string name = x.Key;
                JToken value = x.Value;
                if (x.Value.ToObject<string>().StartsWith(Constants.AT_CHARACTER))
                {
                    string originalValue = x.Value.ToObject<string>();
                    var evaluatedValue = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, originalValue), item);
                    var evaluatedValueString = string.Join(Constants.SEPARATOR_CHARACTER, evaluatedValue);
                    jsonString = jsonString.Replace(originalValue, evaluatedValueString);
                }
            }

            request.AddParameter(parameter.Name, jsonString);
        }

       

        private Method ParseVerb(HttpVerb verb)
        {
            switch (verb)
            {
                case HttpVerb.GET:
                    return Method.GET;
                case HttpVerb.POST:
                    return Method.POST;
                case HttpVerb.PUT:
                    return Method.PUT;
                case HttpVerb.DELETE:
                    return Method.DELETE;
                default:
                    return Method.GET;
            }
        }
    }
}