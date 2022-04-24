using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Entities
{
    public class Bot
    {
        public Bot()
        {
            Versions = new List<BotVersion>();
        }

        public Guid Id { get; set; }

        public string Name { get; set; }

        public DateTime CreatedAt { get; set; }

        public Guid CreatorId { get; set; }

        public DateTime? UpdatedAt { get; set; }

        public Guid? LastUpdateUserId { get; set; }

        public List<BotVersion> Versions { get; set; }

        public string Published { get; set; }

        public bool Active { get; set; }


    }
}
