CREATE TABLE [dbo].[GroupPermission]
(
	[PermissionId] INT NOT NULL , 
    [GroupId] INT NOT NULL, 
    [CreatedAt] DATETIME NOT NULL DEFAULT getdate(), 
    PRIMARY KEY ([GroupId], [PermissionId]), 
    CONSTRAINT [FK_GroupPermission_Permission] FOREIGN KEY (PermissionId) REFERENCES Permission(Id), 
    CONSTRAINT [FK_GroupPermission_Group] FOREIGN KEY (GroupId) REFERENCES [Group](Id)
)
