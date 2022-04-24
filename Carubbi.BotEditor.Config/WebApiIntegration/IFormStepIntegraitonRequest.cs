namespace Carubbi.BotEditor.Config.WebApiIntegration
{
    public interface IFormStepIntegrationRequest<TState>
    {
        TState State { get; set; }
        BotConfig BotConfig { get; set; }
    }
}