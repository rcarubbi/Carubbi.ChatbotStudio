using Microsoft.AspNet.Identity;

namespace Carubbi.BotEditor.Backend.Domain.Entities
{
    public class Permission : IRole<int>
    {
        public Permission(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public string Name { get; set; }

        public int Id { get; internal set; }
    }
}
