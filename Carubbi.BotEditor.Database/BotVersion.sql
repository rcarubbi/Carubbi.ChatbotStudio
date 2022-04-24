CREATE TABLE [dbo].[BotVersion]
(
	[Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY default newid(),
	[Design] varchar(max) not null,
	[Runtime] varchar(max) not null,
	[CreatedAt] DATETIME not null,
	[CreatorId] UNIQUEIDENTIFIER NOT NULL,
	[UpdatedAt] Datetime null,
	[LastUpdateUserId] uniqueidentifier null,
	[PublishedAt] Datetime null,
	[PublisherId] uniqueidentifier null,
	[BotId] UNIQUEIDENTIFIER foreign key (BotId) references Bot(Id)
)
