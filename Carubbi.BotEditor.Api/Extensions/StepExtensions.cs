using Carubbi.BotEditor.Api.Dialogs;
using Carubbi.BotEditor.Config.ConditionInterpreter;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Config.Steps
{
    public static class StepExtensions
    {
        public static string Capitalize(this string s)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }
            // Return char and concat substring.
            return char.ToUpper(s[0]) + s.Substring(1);
        }

        public static void StripFormStepsOutputTypes(this JObject stepsContainer)
        {
            foreach (JObject childStepsContainer in stepsContainer["steps"].Where(p => p["$type"].ToString() == "Carubbi.BotEditor.Config.Steps.CompositeStep, Carubbi.BotEditor.Config"))
            {
                StripFormStepsOutputTypes(childStepsContainer);
            }

            foreach (JObject item in stepsContainer["steps"].Where(p => p["$type"].ToString() == "Carubbi.BotEditor.Config.Steps.FormStep, Carubbi.BotEditor.Config"))
            {
                StripOutputTypes(item);
            }
        }

        public static void StripOutputTypes(this JObject output)
        {
            var outputProperty = output["output"];
            if (outputProperty == null) return;

            var form = outputProperty["form"];
            var p = ((JObject)form).Property("$type");
            p.Remove();
        }

        public static bool ContainsFormStepType(this JObject formStep)
        {
            var form = formStep["form"];
            var p = ((JObject)form).Property("$type");
            return p != null;
        }

        public static void StripFormStepTypes(this JObject formStep)
        {
            var form = formStep["form"];
            var p = ((JObject)form).Property("$type");
            p.Remove();
        }

        private static Dictionary<Type, Type> dialogTypes = new Dictionary<Type, Type>()
        {
            { typeof(MessageStep), typeof(MessageDialog) },
            { typeof(ConfirmStep), typeof(ConfirmDialog) },
            { typeof(ListStep), typeof(ListDialog) },
            { typeof(FormStep), typeof(FormDialog) },
            { typeof(ApiStep), typeof(ApiDialog) },
            { typeof(CompositeStep), typeof(CompositeDialog) },
            { typeof(ImageClassificationStep), typeof(ImageClassificationDialog) },
            { typeof(InputStep), typeof(InputDialog) },
            { typeof(FaqStep), typeof(FaqDialog) },
            { typeof(MapsStep), typeof(MapsDialog) },
            { typeof(ReadGPSLocationStep), typeof(ReadGPSLocationDialog) },
            { typeof(HandoffStep), typeof(HandoffDialog)  }
        };

        public static bool IsOutput(this Step step)
        {
            return step.GetType().GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IOutput<>));
        }

        public static IDialog<object> MakeDialog(this Step step, BotConfig botConfig, IActivity activity, CompositeStep parentStep = null)
        {
            var expressionEvaluator = new ExpressionEvaluator(botConfig, parentStep, activity);
            var dataSource = expressionEvaluator.ResolveDataSource(step.DataSourceExpression);
            if (step is ConditionStep)
            {
                return (step as ConditionStep).Evaluate(botConfig, parentStep, activity, dataSource);
            }

            if (step is SwitchStep)
            {
                return (step as SwitchStep).Evaluate(botConfig, parentStep, activity, dataSource);
            }

            if (step is TransformStep)
            {
                return (step as TransformStep).Evaluate(botConfig, parentStep, activity, dataSource);
            }

            if (dialogTypes.ContainsKey(step.GetType()))
            {
                return (IDialog<object>)dialogTypes[step.GetType()]
                    .GetConstructor(new Type[] { typeof(BotConfig), typeof(CompositeStep), step.GetType() })
                    .Invoke(new object[] { botConfig, parentStep, step });
            }

            throw new ArgumentException(string.Format(Constants.NOT_SUPPORTED_DIALOG_MESSAGE, step.GetType().Name));
        }

        public static IDialog<object> Evaluate(this TransformStep step, BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource)
        {
            step.Output.Clear();
            var expressionEvaluator = new ExpressionEvaluator(botConfig, parentStep, activity);

            foreach (var item in dataSource)
            {
                var value = expressionEvaluator.Evaluate(step.PropertyPath, item).ToString();
                var transformation = step.Transformations.FirstOrDefault(x => x.InputExpression == value);
                if (transformation == null)
                    step.Output.Add(value);
                else
                {
                    try
                    {
                        var jsonObject = JsonConvert.DeserializeObject<dynamic>(transformation.OutputExpression);
                        step.Output.Add(jsonObject);
                    }
                    catch
                    {
                        step.Output.Add(transformation.OutputExpression);
                    }
                }
            }

            var steps = (parentStep ?? (IStepsContainer)botConfig).Steps;
            var targetStep = steps.Single(x => x.Id == step.NextStepId);
            var targetDialog = targetStep.MakeDialog(botConfig, activity, parentStep);
            return targetDialog;
        }

        public static IDialog<object> Evaluate(this ConditionStep step, BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource)
        {
            var stepIdToNavigate = ConditionEvaluator.Evaluate(step.ConditionExpression, botConfig, parentStep, activity, dataSource)
                ? step.TrueStepId
                : step.FalseStepId;

            var stepToNavigate = (parentStep ?? (IStepsContainer)botConfig).Steps.SingleOrDefault(x => x.Id == stepIdToNavigate);
            if (stepToNavigate != null)
            {
                return stepToNavigate.MakeDialog(botConfig, activity, parentStep);
            }
            else
            {
                return null;
            }

        }

        public static IDialog<object> Evaluate(this SwitchStep step, BotConfig botConfig, CompositeStep parentStep, IActivity activity, List<object> dataSource)
        {
            var expressionEvaluator = new ExpressionEvaluator(botConfig, parentStep, activity);
            List<string> values = new List<string>();

            if (dataSource == null)
            {
                values.Add(expressionEvaluator.Evaluate(step.Input, null).ToString());
            }
            else
            {
                foreach (var item in dataSource)
                {
                    values.Add(expressionEvaluator.Evaluate(step.Input, item).ToString());
                }
            }

            var steps = (parentStep ?? (IStepsContainer)botConfig).Steps;
            foreach (var _case in step.Cases)
            {
                if (values.TrueForAll(item => item == _case.Value))
                {
                    if (_case.TargetStepId > 0)
                    {
                        var targetStep = steps.Single(x => x.Id == _case.TargetStepId);
                        var targetDialog = targetStep.MakeDialog(botConfig, activity, parentStep);
                        return targetDialog;
                    }
                }
            }

            if (step.NextStepId.HasValue)
            {
                var nextStep = steps.Single(x => x.Id == step.NextStepId);
                var dialog = nextStep.MakeDialog(botConfig, activity, parentStep);
                return dialog;
            }
            else
            {
                return null;
            }
        }


    }
}