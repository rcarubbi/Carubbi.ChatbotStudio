using System;

namespace Carubbi.BotEditor.Config.Faq
{
    [Serializable]
    public class Settings
    {
        public string KnowledgeBaseId { get; set; }
        public string EndpointKey { get; set; }
        public string Endpoint { get; set; }

        public int? MaxAnswers { get; set; }

        public FaqServiceType ServiceType { get; set; }
    }
}