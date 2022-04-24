using Dapper;
using Carubbi.BotEditor.Backend.DataAccess.Queries;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Backend.DataAccess.Repositories
{
    public class DapperBotRepository : IBotRepository
    {
        private readonly ConnectionManager _connectionManager;

        public DapperBotRepository(ConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public Bot GetById(Guid id)
        {
            var bot = _connectionManager.BotServer.Query<Bot>(BotQueries.GetById, new { id }).FirstOrDefault();
            bot.Versions = _connectionManager.BotServer.Query<BotVersion>(BotQueries.ListVersions, new { BotId = id }).ToList();
            return bot;
        }


        public BotVersion GetLastPublishedVersionById(string botId)
        {
            var botVersion = _connectionManager.BotServer.Query<BotVersion>(BotQueries.GetLastPublishedVersionById, new { botId }).FirstOrDefault();
            return botVersion;
        }
        public BotVersion GetLastVersionById(string botId)
        {
            var botVersion = _connectionManager.BotServer.Query<BotVersion>(BotQueries.GetLastVersionById, new { botId }).FirstOrDefault();
            return botVersion;
        }


        public IEnumerable<Bot> ListAll()
        {
            return _connectionManager.BotServer.Query<Bot>(BotQueries.ListAll);
        }

        public Bot Insert(Bot bot)
        {
            bot.Id = (Guid)_connectionManager.BotServer.Query(BotQueries.Insert, bot).FirstOrDefault().Id;
            return bot;
        }
         
        public void Update(Bot bot)
        {
            _connectionManager.BotServer.Query(BotQueries.Update, bot).FirstOrDefault();
        }

        public void UpdateVersion(BotVersion botVersion)
        {
            _connectionManager.BotServer.Execute(BotQueries.UpdateVersion, botVersion);
        }

        public BotVersion InsertVersion(BotVersion botVersion)
        {
            botVersion.Id = Guid.NewGuid();
            _connectionManager.BotServer.Execute(BotQueries.InsertVersion, botVersion);
            return botVersion;
        }

        public IEnumerable<BotVersion> ListPublishedBotVersions()
        {
            return _connectionManager.BotServer.Query<BotVersion>(BotQueries.ListPublishedBotVersions);
        }

        public IEnumerable<BotVersion> ListLastBotVersions()
        {
            return _connectionManager.BotServer.Query<BotVersion>(BotQueries.ListBotVersions);
        }
    }
}
