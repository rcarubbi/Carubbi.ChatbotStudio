
using System;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ListItem
    {
        public int Order { get; set; }

        public string Title { get; set; }

        public string Subtitle { get; set; }

        public string ImageUrl { get; set; }

        public string ButtonTitle { get; set; }

        public string ButtonValue { get; set; }

        public ItemActions Action { get; set; }

        public int TargetStepId { get; set; }

    }
}