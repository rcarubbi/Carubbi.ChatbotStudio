using Microsoft.Bot.Builder.Dialogs;

namespace Carubbi.BotEditor.Api.Models
{
    internal class AddressKey : IAddress
    {
        public AddressKey()
        {
        }

        public string BotId { get; set; }

        public string ChannelId { get; set; }
        public string UserId { get; set; }
        public string ConversationId { get; set; }
        public string ServiceUrl { get; set; }
    }
}