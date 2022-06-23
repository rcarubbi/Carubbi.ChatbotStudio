using Carubbi.BotEditor.Config.Channels;
using System;

namespace Carubbi.BotEditor.Backend.Domain.Models.Request
{
    public class ChannelRegistrationRequest
    {
        public Guid BotId { get; set; }

        public WhatsAppChannel WhatsAppChannel { get; set; }
        public TelegramChannel TelegramChannel { get; set; }
    }
}
