namespace Carubbi.BotEditor.Config.Steps
{
    public interface IOutput<out T>
    {
        T Output { get; }

        bool Durable { get; set; }

    }
}