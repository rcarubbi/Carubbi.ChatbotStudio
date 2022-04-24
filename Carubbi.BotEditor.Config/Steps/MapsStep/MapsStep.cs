using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class MapsStep : Step, IOutput<Maps.Location>
    {
        public bool Selectable { get; set; }

        public string ApiKey { get; set; }

        public List<LocationSource> Input { get; set; }

        public bool Durable { get; set; }

        public Maps.Location Output { get; set; }

        public MapsServiceType ServiceType { get; set; }
    }
}
