using Carubbi.BotEditor.Backend.Domain.Cache;
using Carubbi.BotEditor.Backend.Domain.Services;
using Carubbi.BotEditor.Config;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Backend.Domain
{
    public class BotConfigService
    {
        private static object _syncRoot = new object();
        private readonly IBotConfigCache _botConfigCache;
        private readonly BotService _botService;

        public BotConfigService(IBotConfigCache botConfigCache, BotService botService)
        {
            _botConfigCache = botConfigCache;
            _botService = botService;
        }

        public BotConfig GetConfig(string botId, bool published)
        {
            if (!_botConfigCache.TryGet(botId, out var config))
            {
                config = _botService.GetById(botId, published);
                lock (_syncRoot)
                {
                    _botConfigCache.Set(botId, config);
                }
            }
            return config;
        }


        public bool Any(Func<BotConfig, bool> predicate, bool published)
        {
            var anyInCache = _botConfigCache.Filter(predicate).Any();
            if (anyInCache)
            {
                return true;
            }
            else
            {
                return _botService.ContainsAnyBotVersion(predicate, published);
            }
        }

        public void InvalidateCache(string botId)
        {
            lock (_syncRoot)
            {
                _botConfigCache.Invalidate(botId);
            }
        }

        public IEnumerable<BotConfig> List(bool published)
        {
            var configsInCache = _botConfigCache.Filter(x => true);
            var total = published
                ? _botService.CountLastPublishedBotVersions() 
                : _botService.CountLastBotVersions();
 
            if (configsInCache.Count() == total)
            {
                return configsInCache;
            }
            else
            {
                Func<BotConfig, bool> notInCacheFilter = x => !configsInCache.Select(c => c.Name).Contains(x.Name);
                var configsNotCached = published
                    ? _botService.ListPublishedBotConfigs(notInCacheFilter)
                    : _botService.ListBotConfigs(notInCacheFilter);

                return configsInCache.Union(configsNotCached);
            }
        }

        public void RefreshCache(IEnumerable<BotConfig> bots)
        {
            lock (_syncRoot)
            {
                foreach (var item in bots)
                {
                    _botConfigCache.Invalidate(item.Id.ToString());
                    _botConfigCache.Set(item.Id.ToString(), item);
                }
            }
        }
    }
}