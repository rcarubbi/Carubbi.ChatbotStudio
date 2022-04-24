using System.Collections.Generic;

namespace Carubbi.BotEditor.Services.SpeechSysthesizer
{
    public class InMemorySpeechSynthesizerCache : ISpeechSynthesizerCache
    {
        private Dictionary<string, string> _cache = new Dictionary<string, string>();

        public void Set(string key, string url)
        {
            if (_cache.ContainsKey(key)) Invalidate(key);

            _cache.Add(key, url);
        }

        public void Invalidate(string key)
        {
            _cache.Remove(key);
        }

        public bool TryGetUrl(string key, out string url)
        {
            return _cache.TryGetValue(key, out url);
        }
    }
}