namespace Carubbi.BotEditor.Backend.DataAccess.Queries
{
    public static class BotQueries
    {
        public static string GetById { get => "SELECT * FROM BOT (READPAST)  WHERE ID = @ID"; }
        public static string ListAll { get => @"SELECT 
                                                    [Id],
	                                                [Name], 
	                                                case dev.count 
		                                                when 0 then 'Sim' 
		                                                else 'Não' 
	                                                end as published 
                                                FROM BOT b (READPAST)  
	                                                cross apply (
		                                                select count(1) as [count] 
			                                                from BOTVERSION bv (READPAST) 
			                                                where b.Id = bv.BotId and bv.PublishedAt is null
		                                                ) as dev
                                                WHERE Active = 1"; }
        public static string Insert { get => "INSERT INTO BOT (Name, CreatedAt, CreatorId) OUTPUT INSERTED.Id VALUES (@Name, @CreatedAt, @CreatorId);"; }
        public static string Update { get => "UPDATE BOT SET Active = @Active, Name = @Name, UpdatedAt = @UpdatedAt, LastUpdateUserId = @LastUpdateUserId where Id = @Id"; }
        public static string InsertVersion { get => "INSERT INTO BOTVERSION (Id, Runtime, Design, CreatorId, CreatedAt, BotId) VALUES (@Id, @Runtime, @Design, @CreatorId, @CreatedAt, @BotId)"; }
        public static string UpdateVersion { get => "UPDATE BOTVERSION SET Runtime = @Runtime, Design = @Design, UpdatedAt = @UpdatedAt, LastUpdateUserID = @LastUpdateUserID, PublishedAt = @PublishedAt, PublisherId = @PublisherId WHERE Id = @Id"; }
        public static string ListVersions { get => "SELECT bv.* from BOTVERSION bv (READPAST) inner join bot b (READPAST) on b.id = bv.botid where b.Id= @BotId and b.Active = 1"; }
        public static string GetLastPublishedVersionById { get => "SELECT bv.* from BOTVERSION bv (NOLOCK) inner join bot b (NOLOCK) on b.id = bv.botid where b.Active = 1 and bv.PublishedAt is not null and b.Id = @botId order by bv.PublishedAt desc"; }
        public static string ListPublishedBotVersions { get => "SELECT lastProdBot.* from bot b (READPAST) cross apply (SELECT top 1 bv.* from BOTVERSION bv (READPAST) where bv.PublishedAt is not null and bv.botid = b.id order by bv.PublishedAt desc) as lastProdBot where b.Active = 1"; }
        public static string GetLastVersionById { get => "SELECT bv.* from BOTVERSION bv (NOLOCK) inner join bot b (NOLOCK)  on b.id = bv.botid where b.Active = 1 and b.Id = @botId order by bv.CreatedAt desc"; }
        public static string ListBotVersions { get => "SELECT bots.* from bot b (READPAST) cross apply (SELECT top 1 bv.* from BOTVERSION bv (READPAST) where bv.botid = b.id order by bv.CreatedAt desc) as bots where b.Active = 1"; }
    }
}
