namespace Carubbi.BotEditor.Backend.DataAccess.Queries
{
    internal static class GroupQueries
    {
        internal static string Delete { get => @"DELETE FROM Group Where groupId = @id"; }
        internal static string GetById { get => @"SELECT * FROM Group where Id = @id"; }
        internal static string ListUsersPerGroup
        {
            get => @"SELECT u.* FROM User u inner join GroupUser gu on gu.userId= u.id where groupId = @id";
        }

        internal static string ListPermissionsPerGroup
        {
            get => @"SELECT p.* FROM Permission p inner join GroupPermission gp on gp.permissionId = p.id where Id = @id";
        }

        internal static string ListAll { get => @"SELECT * FROM Group"; }
        internal static string AddPermission { get => @"INSERT INTO GrupoAcessoPermissao (idPermissao, idGrupoAcesso) values(@idPermissao, @idGrupoAcesso)"; }
        internal static string RemovePermission { get => @"DELETE FROM GroupPermission Where GroupId = @groupId and permissionId = @PermissionId"; }
        internal static string ClearPermissions { get => @"DELETE FROM GroupPermission Where GroupId = @id"; }
        internal static string RemoveUser { get => @"DELETE FROM GroupUser Where groupId = @GroupId and UserId = @UserId"; }
        internal static string ClearUsers { get => @"DELETE FROM GroupUser Where groupId = @id"; }
        internal static string AddUser { get => @"INSERT INTO GroupUser (userId, groupId) values(@userId, @groupId)"; }
        internal static string Insert { get => @"INSERT INTO Group VALUES (@Name, 1); select @Scope_Identity();"; }
        internal static string Update { get => @"UPDATE Group set Name = @Name, Active= @Active, UpdatedAt = GETDATE() WHERE Id = @Id;"; }
    }
}
