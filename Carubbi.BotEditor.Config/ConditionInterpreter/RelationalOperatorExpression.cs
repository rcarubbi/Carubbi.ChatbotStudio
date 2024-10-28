using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Config.ConditionInterpreter
{
    internal class RelationalOperationExpression : IExpression
    {
        private readonly string _leftSide;
        private readonly string _rightSide;
        private readonly string _operator;

        internal RelationalOperationExpression(string operation)
        {
            var parts = operation.Trim().Split(' ');
            _leftSide = parts[0].Trim();
            _operator = parts[1];
            _rightSide = parts.Count() == 2? "" : parts[2].Trim();
        }

        public bool Interpret(BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource = null)
        {
            return dataSource == null
                ? InterpretItem(botConfig, parentStep, activity)
                : dataSource.TrueForAll(item => InterpretItem(botConfig, parentStep, activity, item));
        }

        private bool InterpretItem(BotConfig botConfig, CompositeStep parentStep, IActivity activity, object item = null)
        {
            var expressionEvaluator = new ExpressionEvaluator(botConfig, parentStep, activity);
            var leftSide = expressionEvaluator.Evaluate(_leftSide, item);
            var leftSideValue = string.Join(",", leftSide);
            var rightSide = expressionEvaluator.Evaluate(_rightSide, item);
            var rightSideValue = string.Join(",", rightSide);

            switch (_operator)
            {
                case "=":
                    return leftSideValue.Equals(rightSideValue, StringComparison.CurrentCultureIgnoreCase);
                case ">":
                    return Convert.ToDecimal(leftSideValue) > Convert.ToDecimal(rightSideValue);
                case "<":
                    return Convert.ToDecimal(leftSideValue) < Convert.ToDecimal(rightSideValue);
                case "<=":
                    return Convert.ToDecimal(leftSideValue) <= Convert.ToDecimal(rightSideValue);
                case ">=":
                    return Convert.ToDecimal(leftSideValue) >= Convert.ToDecimal(rightSideValue);
                case "<>":
                    return !leftSideValue.Equals(rightSideValue, StringComparison.CurrentCultureIgnoreCase);
                default:
                    throw new NotSupportedException();
            }
        }
    }
}
