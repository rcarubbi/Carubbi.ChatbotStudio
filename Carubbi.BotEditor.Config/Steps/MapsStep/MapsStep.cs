using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class MapsStep : Step, IOutput<MapsOutput>
    {
        public bool Selectable { get; set; }

        public string ApiKey { get; set; }

        public List<LocationSource> Input { get; set; }

        public bool Durable { get; set; }

        public MapsOutput Output { get; set; }

        public MapsServiceType ServiceType { get; set; }
    }
}
