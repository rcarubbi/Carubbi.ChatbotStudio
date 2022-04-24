using Carubbi.BotEditor.Config;
using Microsoft.Bot.Builder.History;
using Microsoft.Bot.Connector;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using System.Threading.Tasks;
using static Microsoft.Bot.Builder.Azure.TableLogger;

namespace Carubbi.BotEditor.Api.State
{
    public class AzureTablesActivityLogger : IActivityLogger
    {
        private readonly BotInstanceSettings _settings;

        public AzureTablesActivityLogger(BotInstanceSettings settings)
        {
            _settings = settings;
        }

        public async Task LogAsync(IActivity activity)
        {
            var entity = new ActivityEntity(activity);

            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(_settings.ConnectionString);
            CloudTableClient tableClient = storageAccount.CreateCloudTableClient();
            string tableName = $"{_settings.Name.Replace(" ", "")}ActivityLog";
            CloudTable table = tableClient.GetTableReference(tableName);

            TableOperation insertOperation = TableOperation.InsertOrMerge(entity);
            await table.CreateIfNotExistsAsync();
            table.Execute(insertOperation);
        }
    }
}