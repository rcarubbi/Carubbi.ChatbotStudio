using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Connector;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.ConditionInterpreter
{
    internal class AndOperatorExpression : IExpression
    {
        private readonly IExpression _left;
        private readonly IExpression _right;

        internal AndOperatorExpression(IExpression left, IExpression right)
        {
            _left = left;
            _right = right;
        }

        public bool Interpret(BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource)
        {
           return _left.Interpret(botConfig, parentStep, activity, dataSource) && _right.Interpret(botConfig, parentStep, activity, dataSource);
        }
    }
}