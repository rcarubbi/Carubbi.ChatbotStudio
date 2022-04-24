CREATE TABLE [dbo].[Bot]
(
	[Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT newid(),
	[Name] VARCHAR(100) NOT NULL,
	[CreatedAt] DATETIME not null,
	[CreatorId] UNIQUEIDENTIFIER NOT NULL,
	[UpdatedAt] Datetime null,
	[LastUpdateUserId] uniqueidentifier null, 
    [Active] BIT NOT NULL DEFAULT 1,


)
