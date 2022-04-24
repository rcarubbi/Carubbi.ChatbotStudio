using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Entities
{
    public class User : IUser<Guid>
    {
        public User()
        {
            Groups = new List<Group>();
        }
        public Guid Id { get; set; }
        public string UserName { get; set; }

        public string Email { get; set; }

        public bool Active { get; set; }

        public List<Group> Groups { get; set; }

        public DateTime? LockoutEndDate { get; set; }

        public int AccessFailedCount { get; set; }

        public bool BlockEnabled { get; set; }

        public string Password { get; set; }

        public bool TwoFactorEnabled { get; set; }

        public bool EmailConfirmed { get; set; }

         
    }
}
