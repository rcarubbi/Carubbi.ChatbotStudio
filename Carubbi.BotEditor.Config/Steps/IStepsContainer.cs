using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    public interface IStepsContainer
    {
        List<Step> Steps { get; set; }
    }
}