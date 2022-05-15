using Carubbi.BotEditor.Config.Maps;
using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class MapsOutput
    {
        public Location SelectedLocation { get; set; }
        
        public List<Location> Locations { get; set; }
    }
}
