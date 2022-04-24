using Carubbi.BotEditor.Backend.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Repositories
{
    public interface IBotRepository
    {
        IEnumerable<Bot> ListAll();
        Bot GetById(Guid id);
        Bot Insert(Bot bot);

        void Update(Bot bot);

        BotVersion InsertVersion(BotVersion botVersion);

        void UpdateVersion(BotVersion botVersion);
        BotVersion GetLastPublishedVersionById(string botId);

        IEnumerable<BotVersion> ListPublishedBotVersions();
        IEnumerable<BotVersion> ListLastBotVersions();
        BotVersion GetLastVersionById(string botId);
    }
}
