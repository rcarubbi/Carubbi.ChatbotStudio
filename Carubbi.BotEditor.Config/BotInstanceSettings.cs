using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Config
{
    public class BotInstanceSettings
    {
        public string AppId { get; set; }
        public string AppPassword { get; set; }
        public PersistenceStrategies PersistenceStrategy { get; set; }
        public string Name { get; set; }
        public string BotId { get; set; }
        public string ConnectionString { get; set; }
    }
}
