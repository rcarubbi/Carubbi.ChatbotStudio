using Carubbi.BotEditor.Backend.Domain.Cache;
using Carubbi.BotEditor.Config;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Backend.DataAccess.Cache
{
    public class InMemoryBotConfigCache : IBotConfigCache
    {
        private Dictionary<string, BotConfig> _cache = new Dictionary<string, BotConfig>();

        public bool TryGet(string botId, out BotConfig config)
        {
            return _cache.TryGetValue(botId, out config);
        }

        public void Invalidate(string botId)
        {
            if (_cache.ContainsKey(botId)) _cache.Remove(botId);
        }

        public void Set(string botId, BotConfig config)
        {
            if (_cache.ContainsKey(botId)) Invalidate(botId);
            
            _cache.Add(botId, config); 
        }

        public IEnumerable<BotConfig> Filter(Func<BotConfig, bool> predicate)
        {
            return _cache.Values.AsEnumerable().Where(predicate);
        }
    }
}
