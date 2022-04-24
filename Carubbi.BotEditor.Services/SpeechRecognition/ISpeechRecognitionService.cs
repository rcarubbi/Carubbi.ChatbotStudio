using System;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.SpeechRecognition
{
    public interface ISpeechRecognitionService
    {
        Task<string> RecognizeAsync(Uri audioUrl);
    }
}
