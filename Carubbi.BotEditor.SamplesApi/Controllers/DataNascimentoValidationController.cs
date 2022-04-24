
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Config.WebApiIntegration;
using Carubbi.BotEditor.SamplesApi.Models;
using System;
using System.Collections.Generic;
using System.Web.Http;

namespace Carubbi.BotEditor.SamplesApi.Controllers
{
    public class DataNascimentoValidationController : ApiController, IFormStepValidationController<DataNascimentoValidationRequest, DateTime, SampleForm>
    {
        public ValidationResponse Post(DataNascimentoValidationRequest request)
        {
            var year = 365;
            var eighteenYears = new TimeSpan(year * 18, 0, 0, 0, 0);
            if (DateTime.Today.Subtract(request.Value) < eighteenYears)
            {
                return new ValidationResponse
                {
                    Valid = false,
                    ErrorMessages = new List<string> { $"{request.State.Nome}, obrigado pelo interesse mas você precisa ser maior de idade para utilizar este serviço" }
                };
            }
            return new ValidationResponse { Valid = true };

        }
    }
}
