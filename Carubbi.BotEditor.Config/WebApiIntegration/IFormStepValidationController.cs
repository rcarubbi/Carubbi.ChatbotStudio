using Carubbi.BotEditor.Config.Steps;

namespace Carubbi.BotEditor.Config.WebApiIntegration
{
    public interface IFormStepValidationController<TRequest, TValue, TState> where TRequest : IFormStepValidationRequest<TValue, TState>
    {
        ValidationResponse Post(TRequest request);
    }
}
