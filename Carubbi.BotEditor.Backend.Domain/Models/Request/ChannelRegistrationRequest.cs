using Carubbi.BotEditor.Config;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Models.Request
{
    public class ChannelRegistrationRequest
    {
        public Guid BotId { get; set; }

        public List<IChannel> Channels { get; set; }
    }
}
