using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Connector;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.ConditionInterpreter
{
    internal class OrOperatorExpression : IExpression 
    {
        private readonly IExpression leftExpression;
        private readonly IExpression rightExpression;

        internal OrOperatorExpression(IExpression left, IExpression right)
        {
            leftExpression = left;
            rightExpression = right;
        }

        public bool Interpret(BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource)
        {
            return leftExpression.Interpret(botConfig, parentStep, activity, dataSource) || rightExpression.Interpret(botConfig, parentStep, activity, dataSource);
        }
    }
}
