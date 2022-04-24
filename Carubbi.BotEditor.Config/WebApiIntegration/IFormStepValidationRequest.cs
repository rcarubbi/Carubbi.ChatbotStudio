namespace Carubbi.BotEditor.Config.WebApiIntegration
{
    public interface IFormStepValidationRequest<TValue, TState> : IFormStepIntegrationRequest<TState>
    {
        TValue Value { get; set; }

      
    }
}
