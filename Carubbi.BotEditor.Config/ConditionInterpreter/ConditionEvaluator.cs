using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Connector;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Carubbi.BotEditor.Config.ConditionInterpreter
{
    public static class ConditionEvaluator
    {
        static List<Token> TransformToPolishNotation(List<Token> infixTokenList)
        {
            Queue<Token> outputQueue = new Queue<Token>();
            Stack<Token> stack = new Stack<Token>();

            int index = 0;
            while (infixTokenList.Count > index)
            {
                Token t = infixTokenList[index];

                switch (t.type)
                {
                    case Token.TokenType.LITERAL:
                        outputQueue.Enqueue(t);
                        break;
                    case Token.TokenType.BINARY_OP:
                    case Token.TokenType.UNARY_OP:
                    case Token.TokenType.OPEN_PAREN:
                        stack.Push(t);
                        break;
                    case Token.TokenType.CLOSE_PAREN:
                        while (stack.Peek().type != Token.TokenType.OPEN_PAREN)
                        {
                            outputQueue.Enqueue(stack.Pop());
                        }
                        stack.Pop();
                        if (stack.Count > 0 && stack.Peek().type == Token.TokenType.UNARY_OP)
                        {
                            outputQueue.Enqueue(stack.Pop());
                        }
                        break;
                    default:
                        break;
                }

                ++index;
            }
            while (stack.Count > 0)
            {
                outputQueue.Enqueue(stack.Pop());
            }

            return outputQueue.Reverse().ToList();
        }
        
        static IExpression Make(ref List<Token>.Enumerator polishNotationTokensEnumerator)
        {
            if (polishNotationTokensEnumerator.Current.type == Token.TokenType.LITERAL)
            {
                IExpression lit = new RelationalOperationExpression(polishNotationTokensEnumerator.Current.value);
                polishNotationTokensEnumerator.MoveNext();
                return lit;
            }
            else
            {
                if (polishNotationTokensEnumerator.Current.value == "NOT")
                {
                    polishNotationTokensEnumerator.MoveNext();
                    IExpression operand = Make(ref polishNotationTokensEnumerator);
                    return new NotOperatorExpression(operand);
                }
                else if (polishNotationTokensEnumerator.Current.value == "AND")
                {
                    polishNotationTokensEnumerator.MoveNext();
                    IExpression left = Make(ref polishNotationTokensEnumerator);
                    IExpression right = Make(ref polishNotationTokensEnumerator);
                    return new AndOperatorExpression(left, right);
                }
                else if (polishNotationTokensEnumerator.Current.value == "OR")
                {
                    polishNotationTokensEnumerator.MoveNext();
                    IExpression left = Make(ref polishNotationTokensEnumerator);
                    IExpression right = Make(ref polishNotationTokensEnumerator);
                    return new OrOperatorExpression(left, right);
                }
            }
            return null;
        }

        public static bool Evaluate(string expression, BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource)
        {
            List<Token> tokens = new List<Token>();
            StringReader reader = new StringReader(expression);

            //Tokenize the expression
            Token t;
            do
            {
                t = new Token(reader);
                if (t.type == Token.TokenType.LITERAL && string.IsNullOrWhiteSpace(t.value))
                {
                    continue;
                }
                else
                {
                    tokens.Add(t);
                }
            } while (t.type != Token.TokenType.EXPR_END);


            //Use a minimal version of the Shunting Yard algorithm to transform the token list to polish notation
            List<Token> polishNotation = TransformToPolishNotation(tokens);

            var enumerator = polishNotation.GetEnumerator();
            enumerator.MoveNext();
            IExpression root = Make(ref enumerator);
 
            //Eval the expression tree
            return root.Interpret(botConfig, parentStep, activity, dataSource);
        }
    }
}