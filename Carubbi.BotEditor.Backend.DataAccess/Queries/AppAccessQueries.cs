namespace Carubbi.BotEditor.Backend.DataAccess.Queries
{
    public static class AppAccessQueries
    {
        public static string GetByClientId { get => "SELECT * FROM AppAccess WHERE ClientId = @ClientId"; }
        public static string Insert { get => @"
                                                INSERT INTO AppAccess 
                                                (
                                                      ClientId
                                                    , AccessKey
                                                    , SecretKey
                                                    , ApplicationName
                                                ) 
                                                VALUES 
                                                (
                                                    @ClientId
                                                    ,@AccessKey
                                                    ,@SecretKey
                                                    ,@ApplicationName
                                                )"; }

        public static string ListAll { get => "SELECT * FROM AppAccess"; }
    }
}
