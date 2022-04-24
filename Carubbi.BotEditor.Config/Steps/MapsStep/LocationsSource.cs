using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class LocationSource 
    {
        public string Latitude  { get; set; }

        public string Longitude { get; set; }

        public string Address  { get; set; }

        public string ZipCode { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Name { get; set; }

        public string Id { get; set; }
    }
}
