using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;

namespace Carubbi.BotEditor.Backend.DataAccess
{
    public class ConnectionManager : IDisposable
    {
        public ConnectionManager()
        {
            if (ConfigurationManager.ConnectionStrings["Carubbi.BotEditor.IdentityServer"] != null)
            {
                _identityServer = new SqlConnection(ConfigurationManager.ConnectionStrings["Carubbi.BotEditor.IdentityServer"].ConnectionString);
            }

            if (ConfigurationManager.ConnectionStrings["Carubbi.BotEditor.BotsServer"] != null)
            {
                _botsServer = new SqlConnection(ConfigurationManager.ConnectionStrings["Carubbi.BotEditor.BotsServer"].ConnectionString);
            }
        }

        private IDbConnection _botsServer { get; set; }
        private IDbConnection _identityServer { get; set; }


        public IDbConnection IdentityServer
        {
            get
            {
                if (_identityServer.State == ConnectionState.Closed)
                    _identityServer.Open();

                return _identityServer;
            }
        }

        public IDbConnection BotServer
        {
            get
            {
                if (_botsServer.State == ConnectionState.Closed)
                    _botsServer.Open();

                return _botsServer;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            // Suppress finalization.
            GC.SuppressFinalize(this);


        }
        private bool _disposed = false;

        ~ConnectionManager()
        {
            Dispose(false);
        }

        private void Dispose(bool disposing)
        {
            if (_disposed)
                return;

            if (disposing)
            {
                CloseConnection(_identityServer);
                CloseConnection(_botsServer);
            }

            _disposed = true;
        }

        private void CloseConnection(IDbConnection dbConnection)
        {
            if (dbConnection != null)
            {
                if (dbConnection.State == ConnectionState.Open)
                {
                    dbConnection.Close();
                    dbConnection.Dispose();
                }
            }
        }
    }
}
