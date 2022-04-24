using Carubbi.BotEditor.Config;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Cache
{
    public interface IBotConfigCache
    {
        bool TryGet(string botId, out BotConfig config);
        void Invalidate(string botId);
        void Set(string botId, BotConfig config);
        IEnumerable<BotConfig> Filter(Func<BotConfig, bool> predicate);
    }
}