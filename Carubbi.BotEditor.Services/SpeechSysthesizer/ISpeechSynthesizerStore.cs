namespace Carubbi.BotEditor.Services.SpeechSysthesizer
{
    public interface ISpeechSynthesizerStore
    {
        string SaveSysthesis(string filename, byte[] audioData);
    }
}