using Carubbi.BotEditor.Config.Extensions;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.Bot.Connector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using RazorEngine;
using RazorEngine.Configuration;
using RazorEngine.Templating;
using RazorEngine.Text;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Config
{
    [Serializable]
    public class ExpressionEvaluator
    {
       
        private readonly BotConfig _botConfig;
        private readonly CompositeStep _parentStep;
 
        public ExpressionEvaluator(BotConfig botConfig, CompositeStep parentStep, IActivity activity)
        {
            _botConfig = botConfig;
            _parentStep = parentStep;
            Activity = activity;
        }


      
        public IActivity Activity { get; set; }

        public object Evaluate(string expression, object item)
        {
            object context = null;

            var nonNullableExpression = expression ?? string.Empty;

            if (nonNullableExpression.StartsWith("@"))
            {
                var properties = ExpressionToList(nonNullableExpression);

                var firstProperty = properties.First();
                if (firstProperty == $"@{Constants.DATA_SOURCE}")
                {
                    context = item;
                }
                else if (firstProperty == $"@{Constants.START_MESSAGE}")
                {
                    return _botConfig.StartMessage;
                }
                else if (firstProperty == $"@{Constants.CHANNEL_ID}")
                {
                    return Activity.ChannelId;
                }
                else if (firstProperty == $"@{Constants.CONTACT_NAME}") {
                    return Activity.From.Name;
                }
                else
                {
                    int id = GetDialogId(properties.First());

                    var steps = _parentStep == null
                        ? _botConfig.Steps
                        : _parentStep.Steps;

                    var step = steps.Single(x => x.Id == id);
                    context = step;
                }


                properties.RemoveAt(0);
                var propertiesQueue = new Queue<string>(properties);
                return RecursiveResolveValue(context, propertiesQueue);
            }

            return nonNullableExpression;
        }

        private static void InitializeFormStepOutputs(BotConfig botConfig)
        {
            foreach (var formStep in botConfig.GetFormSteps(false))
            {
                var formData = new JObject();
                foreach (var formField in formStep.FormFields)
                {
                    formData.Add(formField.Name, string.Empty);
                }
                if (formStep.Output == null || formStep.Output.Form == null)
                {
                    formStep.Output = new FormResult
                    {
                        Form = formData
                    };
                }
            }
        }

        public List<object> ResolveDataSource(string expression)
        {
            List<object> result = null;

            if (string.IsNullOrWhiteSpace(expression))
            {
                return result;
            }
            else
            {
                var evaluatedValue = Evaluate(expression, null);
                try
                {
                    evaluatedValue = JsonConvert.DeserializeObject(evaluatedValue.ToString());
                }
                catch { }
                finally
                {
                    var collection = evaluatedValue is JArray
                       ? (evaluatedValue as JArray).Children()
                       : (evaluatedValue as IEnumerable<object>);

                    result = collection.ToList();
                }
                return result;
            }
        }

        public string PrepareMessage(int stepId, string message)
        {
            if (string.IsNullOrEmpty(message))
                return string.Empty;

            var viewBag = PrepareViewBag(stepId);
            var config = new TemplateServiceConfiguration();
            config.EncodedStringFactory = new RawStringFactory(); 
            var service = RazorEngineService.Create(config);
            Engine.Razor = service;

            var templateName = $"template{message.GetHashCode()}";
            
            return Engine.Razor.IsTemplateCached(templateName, null)
                ? Engine.Razor.Run(templateName, viewBag: viewBag)
                : Engine.Razor.RunCompile(message, templateName, modelType: typeof(object), model: null, viewBag: viewBag);
        }

        private DynamicViewBag PrepareViewBag(int stepId)
        {
            InitializeFormStepOutputs(_botConfig);
            var viewBag = new DynamicViewBag();
            var data = new Dictionary<string, object>();
            Step currentStep = AddStepsToDictionary(data, _botConfig, stepId);
            

            viewBag.AddDictionary(data);
            viewBag.AddValue(Constants.CONTACT_NAME, Activity.From.Name);
            viewBag.AddValue(Constants.START_MESSAGE, _botConfig.StartMessage);
            viewBag.AddValue(Constants.CHANNEL_ID, Activity.ChannelId);
            viewBag.AddValue(Constants.DATA_SOURCE, ResolveDataSource(currentStep.DataSourceExpression));
            return viewBag;
        }

        private Step AddStepsToDictionary(Dictionary<string, object> data, IStepsContainer container, int stepId)
        {
            Step currentStep = null;
            foreach (var item in container.Steps)
            {
                if (item is CompositeStep)
                {
                    var compositeCurrentStep = AddStepsToDictionary(data, (IStepsContainer)item, stepId);
                    if (compositeCurrentStep != null)
                    {
                        currentStep = compositeCurrentStep;
                    }
                }

                if (item.Id == stepId)
                {
                     currentStep = item;
                }
                data.Add($"Step{item.Id}", item);
            }
            return currentStep;
        }

        private object RecursiveResolveValue(object context, Queue<string> properties)
        {
            object value = null;
            var nextPropertyName = properties.Dequeue();

            var type = context.GetType();
            if (context is JToken)
            {
                var camelCaseNamingStrategy = new CamelCaseNamingStrategy();
                var jsonPropertyName = camelCaseNamingStrategy.GetPropertyName(nextPropertyName, false);
                value = (context as JToken)[jsonPropertyName];
            }
            else
            {
                var nextProperty = type.GetProperties().Single(x => x.Name == nextPropertyName);
                value = nextProperty.GetValue(context);
            }

            context = value;

            var result = (properties.Count == 0)
                ? value
                : RecursiveResolveValue(context, properties);

            return result;
        }

        private List<string> ExpressionToList(string expression)
        {
            var parts = expression.Split('.');
            return parts.ToList();
        }

        private int GetDialogId(string expression)
        {
            var textId = expression.Replace("@", string.Empty);
            return Convert.ToInt32(textId);
        }
    }
}