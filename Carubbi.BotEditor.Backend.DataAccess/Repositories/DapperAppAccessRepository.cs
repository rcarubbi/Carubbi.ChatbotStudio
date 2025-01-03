﻿using Dapper;
using Carubbi.BotEditor.Backend.DataAccess.Queries;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using System.Collections.Generic;
using System.Linq;
using System;

namespace Carubbi.BotEditor.Backend.DataAccess.Repositories
{
    public class DapperAppAccessRepository : IAppAccessRepository
    {
        private readonly ConnectionManager _connectionManager;
        public DapperAppAccessRepository(ConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public AppAccess GetByClientId(string clientId)
        {
           return _connectionManager.IdentityServer.Query<AppAccess>(AppAccessQueries.GetByClientId, new { clientId }).SingleOrDefault();
        }

        public List<AppAccess> ListAll()
        {
            return _connectionManager.IdentityServer.Query<AppAccess>(AppAccessQueries.ListAll).ToList();

        }

        public Guid Save(AppAccess appAccess)
        {
            return _connectionManager.IdentityServer.QueryFirst<Guid>(AppAccessQueries.Insert, appAccess);
        }
    }
}
