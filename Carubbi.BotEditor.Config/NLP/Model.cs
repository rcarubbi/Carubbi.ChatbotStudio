using System;

namespace Carubbi.BotEditor.Config.NLP
{
    [Serializable]
    public class Model
    {
        public string AppId { get; set; }
        public string EndpointPredictionKey { get; set; }
        public string Endpoint { get; set; }
    }
}