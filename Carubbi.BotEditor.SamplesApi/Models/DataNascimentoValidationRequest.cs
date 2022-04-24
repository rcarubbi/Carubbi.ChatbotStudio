using Carubbi.BotEditor.Config.WebApiIntegration;
using System;

namespace Carubbi.BotEditor.SamplesApi.Models
{
    public class DataNascimentoValidationRequest : SampleFormRequest, IFormStepValidationRequest<DateTime, SampleForm>
    { 
        public DateTime Value { get; set; }
    }
}