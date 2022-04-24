using Carubbi.BotEditor.Config;
using Microsoft.CognitiveServices.Speech;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.SpeechSysthesizer
{
    public class BingSpeechSynthesizerService : ISpeechSynthesizerService
    {
        private readonly SpeechSynthesisSettings _synthesisSettings;

        public BingSpeechSynthesizerService(SpeechSynthesisSettings synthesisSettings)
        {
            _synthesisSettings = synthesisSettings;
        }

        public async Task<byte[]> SpeakAsync(string text)
        {
            var config = SpeechConfig.FromSubscription(_synthesisSettings.SubscriptionKey, _synthesisSettings.ServiceRegion);
            config.SpeechSynthesisLanguage = _synthesisSettings.Language;
            config.SpeechSynthesisVoiceName = _synthesisSettings.VoiceName ?? Constants.DEFAULT_VOICE_NAME;
            config.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3);

            using (var synthesizer = new SpeechSynthesizer(config))
            {
                if (text.StartsWith("<speak version=\"1.0\"")) {
                    using (var result = await synthesizer.SpeakSsmlAsync(text))
                    {
                        if (result.Reason == ResultReason.SynthesizingAudioCompleted)
                        {
                            return result.AudioData;
                        }
                        else
                            return null;
                    }
                }
                else {
                    using (var result = await synthesizer.SpeakTextAsync(text))
                    {
                        if (result.Reason == ResultReason.SynthesizingAudioCompleted)
                        {
                            return result.AudioData;
                        }
                        else
                            return null;
                    }
                }
            }
        }



    }
}