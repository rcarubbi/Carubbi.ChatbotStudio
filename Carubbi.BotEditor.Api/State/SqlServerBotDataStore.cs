using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Connector;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Carubbi.BotEditor.Api.State
{
    public class SqlServerBotDataStore : IBotDataStore<BotData>
    {
        private readonly string _connectionString;

        public SqlServerBotDataStore(string connectionString)
        {
            _connectionString = connectionString;
            SqlBotDataContext.AssertDatabaseReady(connectionString);
        }

        public async Task<BotData> LoadAsync(IAddress key, BotStoreType botStoreType, CancellationToken cancellationToken)
        {
            using (var context = new SqlBotDataContext(_connectionString))
            {
                try
                {
                    var entity = await SqlBotDataEntity.GetSqlBotDataEntity(key, botStoreType, context);

                    return entity == null ? new BotData(string.Empty) : new BotData(entity.ETag, entity.GetData());

                    // return botdata 
                }
                catch (System.Data.SqlClient.SqlException err)
                {
                    throw new HttpException((int)HttpStatusCode.InternalServerError, err.Message);
                }
            }
        }

        public async Task SaveAsync(IAddress key, BotStoreType botStoreType, BotData botData, CancellationToken cancellationToken)
        {
            var entity = new SqlBotDataEntity(botStoreType, key.BotId, key.ChannelId, key.ConversationId, key.UserId, botData.Data)
            {
                ETag = botData.ETag,
                ServiceUrl = key.ServiceUrl
            };

            using (var context = new SqlBotDataContext(_connectionString))
            {
                try
                {
                    if (string.IsNullOrEmpty(botData.ETag))
                    {
                        context.BotData.Add(entity);
                    }
                    else if (entity.ETag == "*")
                    {
                        var foundData = await SqlBotDataEntity.GetSqlBotDataEntity(key, botStoreType, context);
                        if (botData.Data != null)
                        {
                            if (foundData == null)
                                context.BotData.Add(entity);
                            else
                            {
                                foundData.Data = entity.Data;
                                foundData.ServiceUrl = entity.ServiceUrl;
                            }
                        }
                        else
                        {
                            if (foundData != null)
                                context.BotData.Remove(foundData);
                        }
                    }
                    else
                    {
                        var foundData = await SqlBotDataEntity.GetSqlBotDataEntity(key, botStoreType, context);
                        if (botData.Data != null)
                        {
                            if (foundData == null)
                                context.BotData.Add(entity);
                            else
                            {
                                foundData.Data = entity.Data;
                                foundData.ServiceUrl = entity.ServiceUrl;
                                foundData.ETag = entity.ETag;
                            }
                        }
                        else
                        {
                            if (foundData != null)
                                context.BotData.Remove(foundData);
                        }
                    }
                    await context.SaveChangesAsync(cancellationToken);
                }
                catch (System.Data.SqlClient.SqlException err)
                {
                    throw new HttpException((int)HttpStatusCode.InternalServerError, err.Message);
                }
            }
        }

        public Task<bool> FlushAsync(IAddress key, CancellationToken cancellationToken)
        {
            return Task.FromResult(true);
        }
    }
}