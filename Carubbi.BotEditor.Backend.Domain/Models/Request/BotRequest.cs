using System;

namespace Carubbi.BotEditor.Backend.Domain.Models.Request
{
    public class BotRequest
    {
        public Guid Id { get; set; }

        public string JsonRuntime { get; set; }

        public string XmlDesign { get; set; }

    }
}