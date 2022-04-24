using System.Collections.Generic;

namespace Carubbi.BotEditor.Backend.Domain.Entities
{
    public class Group
    {
        public Group()
        {
        }

        public Group(int id, string name)
        {
            Name = name;
            Id = id;
        }


        public bool Active { get; set; }

        public int Id { get; set; }

        public string Name { get; set; }

        public List<User> Users { get; set; }

        public List<Permission> Permissions { get; set; }
    }
}