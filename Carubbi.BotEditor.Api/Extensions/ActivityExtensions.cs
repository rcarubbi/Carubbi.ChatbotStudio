using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Connector;
using System.Threading;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Extensions
{
    public static class ActivityExtensions
    {
     
        public static async Task HandleTypingAsync(this Activity instance, ConnectorClient connector)
        {
            var isTypingReply = instance.CreateReply();
            isTypingReply.Type = ActivityTypes.Typing;
            await connector.Conversations.ReplyToActivityAsync(isTypingReply);
        }

        public static async Task UpdateConversationDataAsync<T>(this Activity activity, IBotDataStore<BotData> botDataStore, string dataKey, T value)
        {
            var key = Address.FromActivity(activity);
            var privateConversationData = await botDataStore.LoadAsync(key, BotStoreType.BotPrivateConversationData, CancellationToken.None);
            privateConversationData.SetProperty(dataKey, value);
            await botDataStore.SaveAsync(key, BotStoreType.BotPrivateConversationData, privateConversationData, CancellationToken.None);
            await botDataStore.FlushAsync(key, CancellationToken.None);
        }

        public static async Task<T> ReadConversationDataAsync<T>(this Activity activity, IBotDataStore<BotData> botDataStore, string dataKey)
        {
            var key = Address.FromActivity(activity);
            var privateConversationData = await botDataStore.LoadAsync(key, BotStoreType.BotPrivateConversationData, CancellationToken.None);
            var value = privateConversationData.GetProperty<T>(dataKey);
            return value;
        }


        public static async Task UpdateUserDataAsync<T>(this Activity activity, IBotDataStore<BotData> botDataStore, string dataKey, T value)
        {
            var key = Address.FromActivity(activity);
            var userData = await botDataStore.LoadAsync(key, BotStoreType.BotUserData, CancellationToken.None);
            userData.SetProperty(dataKey, value);
            await botDataStore.SaveAsync(key, BotStoreType.BotUserData, userData, CancellationToken.None);
            await botDataStore.FlushAsync(key, CancellationToken.None);
        }

        public static async Task<T> ReadUserDataAsync<T>(this Activity activity, IBotDataStore<BotData> botDataStore, string dataKey)
        {
            var key = Address.FromActivity(activity);
            var userData = await botDataStore.LoadAsync(key, BotStoreType.BotUserData, CancellationToken.None);
            var value = userData.GetProperty<T>(dataKey);
            return value;
        }

    }
}