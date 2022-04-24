namespace Carubbi.BotEditor.Config.NLP
{
    public interface INLPStep 
    {
        Settings NLPSettings { get; set; }

        INLPResult Output { get; set; }
    }
}