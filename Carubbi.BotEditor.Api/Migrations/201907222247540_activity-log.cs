namespace Carubbi.BotEditor.Api.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class activitylog : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SqlBotActivityLogEntities",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        FromId = c.String(),
                        FromName = c.String(),
                        RecipientId = c.String(),
                        RecipientName = c.String(),
                        TextFormat = c.String(),
                        TopicName = c.String(),
                        HistoryDisclosed = c.Boolean(nullable: false),
                        Local = c.String(),
                        Text = c.String(),
                        Summary = c.String(),
                        ChannelId = c.String(),
                        ServiceUrl = c.String(),
                        ReplyToId = c.String(),
                        Action = c.String(),
                        Type = c.String(),
                        Timestamp = c.DateTimeOffset(nullable: false, precision: 7),
                        ConversationId = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SqlBotActivityLogEntities");
        }
    }
}
