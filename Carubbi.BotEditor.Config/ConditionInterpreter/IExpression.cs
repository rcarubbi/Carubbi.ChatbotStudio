using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Connector;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.ConditionInterpreter
{
    internal interface IExpression
    {
        bool Interpret(BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource);
    }
}
