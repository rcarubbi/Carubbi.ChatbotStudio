using Carubbi.BotEditor.Api.Forms;
using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Models.Response;
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
    }
}