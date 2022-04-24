using System;

namespace Carubbi.BotEditor.Backend.Domain.Entities
{
    public class AppAccess
    {
        public Guid Id { get; set; }
        public string ClientId { get; set; }
        public string AccessKey { get; set; }
        public string SecretKey { get; set; }
        public string ApplicationName { get; set; }
    }
}
