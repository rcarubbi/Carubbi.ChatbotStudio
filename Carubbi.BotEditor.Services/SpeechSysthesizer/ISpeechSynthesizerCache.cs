namespace Carubbi.BotEditor.Services.SpeechSysthesizer
{
    public interface ISpeechSynthesizerCache
    {
        bool TryGetUrl(string key, out string url);
        void Set(string key, string url);

        void Invalidate(string key);
    }
}