using System;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class ApiStep : Step, IOutput<object>
    {
        public ApiStep()
        {
            Parameters = new List<ApiParameter>();
        }

        public HttpVerb Verb { get; set; }

        public string ApiURL { get; set; }

        public List<ApiParameter> Parameters { get; set; }

        public object Output { get; set; }

        public string Resource { get; set; }

        public bool Durable { get; set; }

        public MessageInteractions LoadingMessage { get; set; }

    }
}
