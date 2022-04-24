using System;

namespace Carubbi.BotEditor.Backend.Domain.Entities
{
    public class BotVersion
    {
        public Guid Id { get; set; }

        public string Design { get; set; }

        public string Runtime { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime? PublishedAt { get; set; }

        public Guid BotId { get; set; }

        public Guid CreatorId { get; set; }

        public Guid? PublisherId { get; set; }

        public Guid? LastUpdateUserId { get; set; }

        public DateTime? UpdatedAt { get; set; }
    }
}
