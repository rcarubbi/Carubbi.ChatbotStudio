namespace Carubbi.BotEditor.Backend.DataAccess.Queries
{
    internal static class UserQueries
    {
        internal static string ListAll { get => @"SELECT 
                                                    *
                                                FROM
                                                   [User]"; }

        internal static string GetById { get => @"SELECT 
                                                *
                                           FROM
                                                [User]
                                           WHERE 
                                                ID = @ID"; }
        internal static string ListGroupsPerUser { get => @"SELECT 
                                                            g.*
                                                        FROM 
                                                            [Group] g
                                                        inner join
                                                            GroupUser gu on g.Id = gu.groupId
                                                        where
                                                            gu.userId = @Id"; }
        internal static string ListPermissionsPerUser { get => @"SELECT 
                                                                    P.id as permissionId,
                                                                    P.name as permissionName,
                                                                    gp.groupId
                                                                FROM
                                                                    Permission p
                                                                inner join
                                                                    GroupPermission gp on p.id = gp.permissionId
                                                                inner join
                                                                    GroupUser gu on gu.groupId = gp.groupId
                                                                where gu.userId = @id"; }
        public static string GetByUsername { get => @"SELECT 
                                                *
                                           FROM
                                                [User]
                                           WHERE 
                                                Username = @Username"; }
        internal static string Insert { get => @"INSERT [User]
                                             (
                                                Email
                                                ,Username
                                                ,Password
                                                ,Active
                                             )
                                             OUTPUT INSERTED.ID
                                             VALUES
                                             (
                                                @Email
                                                ,@Username
                                                ,@Password
                                                ,1
                                             );"; }

        internal static string Update { get => @"UPDATE
                                                [User]
                                             SET
                                                 Password = @Password
                                                ,Active = @Active
                                                ,LockoutEndDate = @LockoutEndDate
                                                ,AccessFailedCount = @AccessFailedCount
                                                ,BlockEnabled = @BlockEnabled
                                                ,TwoFactorEnabled = @TwoFactorEnabled,
                                                ,EmailConfirmed = @EmailConfirmed,
                                                ,UpdatedAt = GETDATE()
                                            WHERE
                                                ID = @ID"; }
        internal static string Delete { get => @"DELETE FROM [User] WHERE Id = @Id"; }
        public static string GetByEmail { get => @"SELECT 
                                                *
                                           FROM
                                                [User]
                                           WHERE 
                                                Email = @Email"; }
    }
}
