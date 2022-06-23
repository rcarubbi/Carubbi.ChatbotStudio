using Carubbi.BotEditor.Api.Forms;
using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Models.Response;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Carubbi.BotEditor.Api.Controllers
{
    public class BotRuntimeController : ApiController
    {
        public BotRuntimeResponse Post(BotRuntimeRequest request)
        {
            // Chamar no 1o. publish
            var formStepService = new FormStepService(request.BotConfig);
            var response = request.FormSteps.Count > 0
                ? formStepService.CreateForms(request.FormSteps)
                : new BotRuntimeResponse
                {
                    FormStepResults = new List<FormStepResult>
                    {
                              new FormStepResult(0, true, new string[]{ })
                    }
                };

            if (response.FormStepResults.All(x => x.Success))
            {
                var tenantManager = new TenantManager();
                tenantManager.AddTenant(request.BotConfig.Id.ToString());
            }

            return response;
        }

        public BotRuntimeResponse Put(BotRuntimeRequest request)
        {
            // TODO: Chamar nos demais publishes
            var formStepService = new FormStepService(request.BotConfig);
            var response = request.FormSteps.Count > 0
               ? formStepService.UpdateForms(request.FormSteps)
               : new BotRuntimeResponse
               {
                   FormStepResults = new List<FormStepResult>
                   {
                       new FormStepResult(0, true, new string[]{ })
                   }
               };

            if (response.FormStepResults.All(x => x.Success))
            {
                var tenantManager = new TenantManager();
                tenantManager.UpdateTenant(request.BotConfig.Id.ToString());
            }

            return response;
        }

        public BotRuntimeResponse Delete(BotRuntimeRequest request)
        {

            var formStepService = new FormStepService(request.BotConfig);
            formStepService.ClearForms();
            var tenantManager = new TenantManager();
            tenantManager.RemoveTenant(request.BotConfig.Id.ToString());

            return new BotRuntimeResponse { FormStepResults = new List<FormStepResult> { new FormStepResult(0, true, new string[] { }) } };
        }

        //[HttpPost]
        //[Route("api/botRuntime/intellisense")]
        //public string[] Intellisense(string term, BotConfig botConfig)
        //{

        //    var validStepProperyNames = botConfig.Steps.Select(x => $"Step{x.Id}");
        //    var startProperties = new List<string>() { Constants.DATA_SOURCE,
        //                                    Constants.START_MESSAGE,
        //                                    Constants.CHANNEL_ID,
        //                                    Constants.CONTACT_NAME,
        //            }.Union(validStepProperyNames).ToList();

        //    var allTerms = new Dictionary<string, List<string>>()
        //    {
        //        {
        //            "@@", startProperties
        //        },
        //    };

        //    foreach (var step in botConfig.Steps)
        //    {
        //        var type = botConfig.Steps.Single(x => x.Id == step.Id).GetType();
        //        var properties = type.GetProperties().Select(pi => pi.Name).ToList();

        //        allTerms.Add($"Step{step.Id}", properties);
        //        AddTermsRecursively(allTerms, type, properties);
        //    }
            
        //    var sanitizedTerm = term.Replace(".", string.Empty);

        //    foreach(var key in allTerms.Keys)
        //    {
        //        sanitizedTerm = term.Replace(key, string.Empty);
        //    }

        //    return allTerms.Keys.Where(k => k.StartsWith(sanitizedTerm)).SelectMany(k => allTerms[k]).ToArray();

        //}

        //private void AddTermsRecursively(Dictionary<string, List<string>> allTerms, Type type, IEnumerable<string> properties)
        //{
        //    foreach(var property in properties)
        //    {
        //        var childType = type.GetProperty(property).GetType();
        //        var childProperties = childType.GetProperties().Select(pi => pi.Name).ToList());

        //        allTerms.Add(property, childProperties);
        //        AddTermsRecursively(allTerms, childType, childProperties);
        //    }
        //}
    }
}