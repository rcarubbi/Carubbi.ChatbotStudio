CREATE TABLE [dbo].[GroupUser]
(
	[UserId] UNIQUEIDENTIFIER NOT NULL , 
    [GroupId] INT NOT NULL, 
    [CreatedAt] DATETIME NOT NULL DEFAULT getdate(), 
    PRIMARY KEY ([UserId], [GroupId]), 
    CONSTRAINT [FK_GroupUser_Group] FOREIGN KEY (GroupId) REFERENCES [Group](Id), 
    CONSTRAINT [FK_GroupUser_User] FOREIGN KEY (UserId) REFERENCES [User](Id)
)
