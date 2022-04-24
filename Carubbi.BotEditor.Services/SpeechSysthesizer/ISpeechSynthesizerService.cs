using System.IO;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.SpeechSysthesizer
{
    public interface ISpeechSynthesizerService
    {
        Task<byte[]> SpeakAsync(string text);
    }
}