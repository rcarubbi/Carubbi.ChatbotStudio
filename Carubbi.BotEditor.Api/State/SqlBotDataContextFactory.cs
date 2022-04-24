using System.Data.Entity.Infrastructure;

namespace Carubbi.BotEditor.Api.State
{
    public class SqlBotDataContextFactory : IDbContextFactory<SqlBotDataContext>
    {
        public SqlBotDataContext Create()
        {
            return new SqlBotDataContext("BotDataContextConnectionString");
        }
    }
}