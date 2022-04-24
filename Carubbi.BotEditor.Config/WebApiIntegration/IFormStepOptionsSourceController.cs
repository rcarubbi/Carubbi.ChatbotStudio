using Carubbi.BotEditor.Config.Steps;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.WebApiIntegration
{
    public interface IFormStepOptionsSourceController<TState, TRequest> where TRequest : IFormStepIntegrationRequest<TState>
    {
        List<FieldOption> Post(TRequest request);
    }
}
