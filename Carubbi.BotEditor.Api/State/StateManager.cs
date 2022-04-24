using Autofac;
using Microsoft.Bot.Builder.Dialogs.Internals;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.State
{
    public class StateManager
    {
        public static async Task DeleteProfile(ILifetimeScope scope)
        {
            var botData = scope.Resolve<IBotData>();
            await botData.LoadAsync(default);
            botData.UserData.Clear();
            botData.PrivateConversationData.Clear();
            await botData.FlushAsync(default);
        }

        public static async Task ClearDialogStack(ILifetimeScope scope)
        {
            var botData = scope.Resolve<IBotData>();
            await botData.LoadAsync(default);
            var stack = scope.Resolve<IDialogStack>();
            stack.Reset();
            await botData.FlushAsync(default);
        }
    }
}