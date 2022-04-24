using Autofac;
using Carubbi.BotEditor.Config;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.SpeechSysthesizer
{
    public class SpeechSynthesizerManager
    {
        private readonly ISpeechSynthesizerService _speechSynthesizerService;
        private readonly ISpeechSynthesizerCache _speechSynthesizerCache;
        private readonly ISpeechSynthesizerStore _speechSysthesizerStore;

        public SpeechSynthesizerManager(ILifetimeScope scope, BotConfig botConfig)
        {
            if (botConfig.SpeechSettings != null)
            {
                _speechSynthesizerService = scope.ResolveKeyed<ISpeechSynthesizerService>(botConfig.SpeechSettings.Synthesis.ServiceType,
                    new TypedParameter(typeof(SpeechSynthesisSettings), botConfig.SpeechSettings.Synthesis));

                _speechSynthesizerCache = scope.ResolveKeyed<ISpeechSynthesizerCache>(botConfig.SpeechSettings.Synthesis.CacheType);
                _speechSysthesizerStore = scope.ResolveKeyed<ISpeechSynthesizerStore>(botConfig.SpeechSettings.Synthesis.StoreType);
            }
        }

        public string SaveSysthesis(byte[] audioData, string key)
        {
            var url = _speechSysthesizerStore.SaveSysthesis(key, audioData);
            _speechSynthesizerCache.Set(key, url);
            return url;
        }

        public async Task<string> GetUrlAsync(string senderId, string evaluatedMessage)
        {
            var key = $"msg{senderId}{evaluatedMessage.GetHashCode()}";
            
            if (!_speechSynthesizerCache.TryGetUrl(key, out var url))
            {
                var audioData = await _speechSynthesizerService.SpeakAsync(Sanitize(evaluatedMessage));
                url = SaveSysthesis(audioData, key);
            }

            return url;
        }

        private string Sanitize(string evaluatedMessage)
        {
            var termsBlackList = new List<string>()
            {
                "*",
            };

            termsBlackList.ForEach(term => evaluatedMessage = evaluatedMessage.Replace(term, string.Empty));
            
            return evaluatedMessage;
        }
    }
}