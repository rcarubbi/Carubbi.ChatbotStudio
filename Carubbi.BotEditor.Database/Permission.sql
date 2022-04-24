CREATE TABLE [dbo].[Permission]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [Name] VARCHAR(50) NOT NULL, 
    [CreatedAt] datetime NOT NULL DEFAULT getdate()
)