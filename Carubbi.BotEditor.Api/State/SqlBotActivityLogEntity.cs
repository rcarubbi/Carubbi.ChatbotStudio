using System;

namespace Carubbi.BotEditor.Api.State
{
    public class SqlBotActivityLogEntity
    {
        public string Id { get; set; }
        public string FromId { get; set; }
        public string FromName { get; set; }
        public string RecipientId { get; set; }
        public string RecipientName { get; set; }
        public string TextFormat { get; set; }
        public string TopicName { get; set; }
        public bool HistoryDisclosed { get; set; }
        public string Local { get; set; }
        public string Text { get; set; }
        public string Summary { get; set; }
        public string ChannelId { get; set; }
        public string ServiceUrl { get; set; }
        public string ReplyToId { get; set; }
        public string Action { get; set; }
        public string Type { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public string ConversationId { get; set; }

    }
}