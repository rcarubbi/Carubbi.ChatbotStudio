namespace Carubbi.BotEditor.Config.WebApiIntegration
{
    public interface IFormStepActiveController<TState, TRequest> where TRequest : IFormStepIntegrationRequest<TState>
    {
        bool Post(TRequest request);
    }
}
