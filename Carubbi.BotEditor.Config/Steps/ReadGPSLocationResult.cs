using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ReadGPSLocationResult
    {
        public string Latitude { get; set; }

        public string Longitude { get; set; }

    }
}