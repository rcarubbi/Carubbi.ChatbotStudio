INSERT INTO [dbo].[Permission] ([Id], [Name], [CreatedAt]) VALUES (1, N'Listar Bots', N'2019-10-17 14:20:32')
INSERT INTO [dbo].[Permission] ([Id], [Name], [CreatedAt]) VALUES (2, N'Criar/Alterar Bots', N'2019-10-17 14:20:41')
INSERT INTO [dbo].[Permission] ([Id], [Name], [CreatedAt]) VALUES (3, N'Listar Usuários', N'2019-10-17 14:20:49')
INSERT INTO [dbo].[Permission] ([Id], [Name], [CreatedAt]) VALUES (4, N'Alterar Usuários', N'2019-10-17 14:20:56')
INSERT INTO [dbo].[Permission] ([Id], [Name], [CreatedAt]) VALUES (5, N'Listar Grupos de Acesso', N'2019-10-17 14:21:04')
INSERT INTO [dbo].[Permission] ([Id], [Name], [CreatedAt]) VALUES (6, N'Criar/Alterar Grupos de Acesso', N'2019-10-17 14:21:11')

SET IDENTITY_INSERT [dbo].[Group] ON
INSERT INTO [dbo].[Group] ([Id], [Name], [Active], [CreatedAt], [UpdatedAt]) VALUES (1, N'Administradores', 1, N'2019-10-17 14:22:57', NULL)
SET IDENTITY_INSERT [dbo].[Group] OFF 

INSERT INTO [dbo].[GroupPermission] ([PermissionId], [GroupId], [CreatedAt]) VALUES (1, 1, N'2019-10-17 14:23:28')
INSERT INTO [dbo].[GroupPermission] ([PermissionId], [GroupId], [CreatedAt]) VALUES (2, 1, N'2019-10-17 14:23:30')
INSERT INTO [dbo].[GroupPermission] ([PermissionId], [GroupId], [CreatedAt]) VALUES (3, 1, N'2019-10-17 14:23:32')
INSERT INTO [dbo].[GroupPermission] ([PermissionId], [GroupId], [CreatedAt]) VALUES (4, 1, N'2019-10-17 14:23:33')
INSERT INTO [dbo].[GroupPermission] ([PermissionId], [GroupId], [CreatedAt]) VALUES (5, 1, N'2019-10-17 14:23:35')
INSERT INTO [dbo].[GroupPermission] ([PermissionId], [GroupId], [CreatedAt]) VALUES (6, 1, N'2019-10-17 14:23:37') 

INSERT INTO DBO.GroupUser (UserId, GroupId) values('5BBD4D0F-41A2-4116-B2F8-AB037FA8579F', 1)