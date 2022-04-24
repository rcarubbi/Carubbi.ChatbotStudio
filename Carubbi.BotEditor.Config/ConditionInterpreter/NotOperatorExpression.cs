using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Connector;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.ConditionInterpreter
{
    internal class NotOperatorExpression : IExpression
    {
        private readonly IExpression _leftExpression;

        internal NotOperatorExpression(IExpression leftExpression)
        {
            _leftExpression = leftExpression;
        }

        public bool Interpret(BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource)
        {
            return !_leftExpression.Interpret(botConfig, parentStep, activity, dataSource);
        }
    }
}
