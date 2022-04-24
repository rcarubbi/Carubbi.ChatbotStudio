CREATE TABLE [dbo].[User]
(
	[Id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT newid(), 
    [UserName] VARCHAR(50) NOT NULL, 
	[Email] VARCHAR(50) NOT NULL, 
    [Password] VARCHAR(3000) NOT NULL, 
    [Active] BIT NOT NULL, 
    [CreatedAt] DATETIME NOT NULL DEFAULT getdate(), 
	[UpdatedAt] DATETIME NULL,
    [LockoutEndDate] DATETIME NULL, 
    [AccessFailedCount] INT NOT NULL DEFAULT 0, 
    [BlockEnabled] BIT NOT NULL DEFAULT 0, 
    [TwoFactorEnabled] BIT NOT NULL DEFAULT 0, 
    [EmailConfirmed] BIT NOT NULL DEFAULT 0
)