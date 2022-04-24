using Autofac;
using Carubbi.BotEditor.Backend.Domain.Autofac;
using Carubbi.BotEditor.Backend.Domain.Models.Response;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.FormsIntegration;
using Carubbi.BotEditor.Services.Autofac;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.FormFlow;
using Microsoft.Bot.Connector;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.Emit;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Forms
{
    public class FormStepBuilder
    {
        private StringBuilder _properties = new StringBuilder();
        private StringBuilder _formBuilderProperties = new StringBuilder();
        private StringBuilder _enums = new StringBuilder();
        private StringBuilder _getStoredFields = new StringBuilder();
        private StringBuilder _attachPreviousNlpEntities = new StringBuilder();
        private StringBuilder _replaceFieldValuesInQuestion = new StringBuilder();
        private string _summary = string.Empty;
        private string _saveAnswers = string.Empty;
        private string _saveAnswersMethod = string.Empty;
        private int enumCount;
        private IEnumerable<FormField> _storedFields;
        private Dictionary<int, string> _enumNamesDictionary = new Dictionary<int, string>();
        private string _speechSynthesizerCreateInstance = string.Empty;

        public FormStepResult Build(BotConfig botConfig, FormStep step)
        {
            if (botConfig.SpeechSettings != null)
            {
                _speechSynthesizerCreateInstance = "speechSynthesizerManager = Conversation.Container.Resolve<SpeechSynthesizerManager>();";
            }
             
            _properties.Clear();
            _formBuilderProperties.Clear();
            _replaceFieldValuesInQuestion.Clear();
            _enums.Clear();
            _attachPreviousNlpEntities.Clear();

            if (step.ContainsRestoreFields())
            {
                _storedFields = step.GetStoredFields();
            }

            foreach (var field in step.FormFields.OrderBy(x => x.Order))
            {

                GenerateProperty(field, step);

                if (field.Type == FieldTypes.ManyOptions)
                {
                    if (string.IsNullOrEmpty(field.OptionsSource))
                    {
                        _attachPreviousNlpEntities.AppendLine($"{field.Name} = GetValue<List<{GetFriendlyName(field)}>>(dataBag, \"Entity|{field.Name}|{field.Id}\");");
                    }
                    else
                    {
                        _attachPreviousNlpEntities.AppendLine($"{field.Name} = GetValue<List<string>>(dataBag, \"Entity|{field.Name}|{field.Id}\");");
                    }
                }
                else if (field.Type == FieldTypes.SingleOption)
                {
                    if (string.IsNullOrEmpty(field.OptionsSource))
                    {
                        _attachPreviousNlpEntities.AppendLine($"{field.Name} = GetValue<{GetFriendlyName(field)}?>(dataBag, \"Entity|{field.Name}|{field.Id}\");");
                    }
                    else
                    {
                        _attachPreviousNlpEntities.AppendLine($"{field.Name} = GetValue<string>(dataBag, \"Entity|{field.Name}|{field.Id}\");");
                    }
                }
                else
                {
                    _attachPreviousNlpEntities.AppendLine($"{field.Name} = GetValue<{GetFriendlyName(field)}>(dataBag, \"Entity|{field.Name}|{field.Id}\");");
                }
            }

            if (step.ContainsRestoreFields())
            {
                _saveAnswers = "fb.OnCompletion(SaveAnswers);";

                var currentPropertyValues = new StringBuilder();
                foreach (var item in _storedFields)
                {
                    _getStoredFields.AppendLine($"Previous{item.Name} = GetValue<{GetFriendlyName(item)}>(dataBag, \"{item.Name}|{item.Id}\");");
                    currentPropertyValues.AppendLine($"currentPropertyValues.Add(\"{item.Name}|{item.Id}\", {item.Name}?.ToString());");
                }

                _saveAnswersMethod = $@"private Task SaveAnswers(IDialogContext context, object state)
                                       {{
                                            var currentPropertyValues = new Dictionary<string, string>();

                                            {currentPropertyValues.ToString()}

                                            foreach (KeyValuePair<string, string> kvp in currentPropertyValues)
                                            {{
                                                context.UserData.SetValue(kvp.Key, state.GetType().GetProperty(kvp.Key.Split('|')[0]).GetValue(state).ToString());
                                            }}

                                            return Task.CompletedTask;
                                        }}";
            }

            if (step.ShowSummary)
            {
                _summary = $"fb.Confirm(\"{IncludeFieldList(step)} {IncludeSummaryText(step)} {IncludeConfirmationButtonsOnSummary(step)}\");";
            }

            SyntaxTree syntaxTree = WriteClass(botConfig.Name.Replace(" ", ""), step);

            var references = new MetadataReference[]
            {
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(object).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(Enumerable).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(List<>).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(IForm<>).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(SerializableAttribute).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(Task).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(StateCallBack).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(Assembly).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(CallSiteHelpers).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(AssemblyRegistrationFlags).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(JsonConvert).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(WebClient).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(BotConfigModule).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(ServicesModule).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(IMessageActivity).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(BotConfig).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(Conversation).Assembly.Location)),
                MetadataReference.CreateFromImage(File.ReadAllBytes(typeof(IContainer).Assembly.Location)),
            };


            return Compile(botConfig, step, syntaxTree, references);
        }

        private string IncludeSummaryText(FormStep step)
        {
            return step.SummaryText ?? "As informações preenchidas estão corretas? Você pode editá-las se necessário.";
        }

        private string IncludeConfirmationButtonsOnSummary(FormStep step)
        {
            return step.IncludeConfirmationButtonsOnSummary ? "{||}" : string.Empty;
        }

        private string IncludeFieldList(FormStep step)
        {
            return step.IncludeFieldListOnSummary ? "{*}" : string.Empty;
        }

        private FormStepResult Compile(BotConfig botConfig, FormStep step, SyntaxTree syntaxTree, MetadataReference[] references)
        {
            var className = $"Step{step.Id}";
            var version = step.Version;
            var basePath = botConfig.GetDynamicStateBasePath();
            if (!Directory.Exists(basePath))
                Directory.CreateDirectory(basePath);

            string fullPath = Path.Combine(basePath, $"{className}V{version}.dll");


            var options = new CSharpCompilationOptions(OutputKind.DynamicallyLinkedLibrary)
                .WithPlatform(Platform.X64);

            CSharpCompilation compilation = CSharpCompilation.Create(
                $"{className}V{version}",
                syntaxTrees: new[] { syntaxTree },
                references: references,
                options: options);

            if (File.Exists(fullPath))
                File.Delete(fullPath);

            using (var fs = new FileStream(fullPath, FileMode.Create, FileAccess.Write))
            {
                try
                {
                    EmitResult result = compilation.Emit(fs);

                    if (!result.Success)
                    {
                        IEnumerable<Diagnostic> failures = result.Diagnostics.Where(diagnostic =>
                            diagnostic.IsWarningAsError ||
                            diagnostic.Severity == DiagnosticSeverity.Error);

                        List<string> errorMessages = new List<string>();
                        foreach (Diagnostic diagnostic in failures)
                        {
                             errorMessages.Add(diagnostic.GetMessage());
                        }
                        return new FormStepResult(step.Id, false, errorMessages.ToArray());
                    }
                }
                catch
                {

                }
            }

            return new FormStepResult(step.Id, true, null);
        }

        private SyntaxTree WriteClass(string botName, FormStep step)
        {
            var className = $"Step{step.Id}";
            var version = step.Version;
            var classText = $@"
                    using Autofac;
                    using Carubbi.BotEditor.Config;
                    using Carubbi.BotEditor.Config.Extensions;
                    using Carubbi.BotEditor.Config.NLP;
                    using Carubbi.BotEditor.Config.Steps;
                    using Carubbi.BotEditor.FormsIntegration;
                    using Carubbi.BotEditor.Services.Nlp;
                    using Carubbi.BotEditor.Services.SpeechSysthesizer;
                    using Microsoft.Bot.Builder.Dialogs;
                    using Microsoft.Bot.Builder.FormFlow;
                    using Microsoft.Bot.Builder.FormFlow.Advanced;
                    using Microsoft.Bot.Connector;
                    using System;
                    using System.Linq;
                    using System.Threading.Tasks;
                    using System.Collections.Generic;
                    using System.Runtime.Serialization;
                    using System.Reflection;
                    using System.Runtime.CompilerServices;
                    using System.Runtime.InteropServices;
                    using Newtonsoft.Json;

                    [assembly: AssemblyTitle(""{className}V{version}"")]
                    [assembly: AssemblyProduct(""{className}V{version}"")]
                    [assembly: AssemblyCopyright(""Copyright ©  2017"")]
                    [assembly: AssemblyCulture(""pt-BR"")]
                    [assembly: ComVisible(false)]
                    [assembly: Guid(""{Guid.NewGuid()}"")]
                    [assembly: AssemblyVersion(""{version}.0.0.0"")]
                    [assembly: AssemblyFileVersion(""{version}.0.0.0"")]

                    namespace {botName}
                    {{
                        {_enums.ToString()}

                        
                        [Serializable]
                        public class {className} 
                        {{
                             protected T GetValue<T>(IBotDataBag dataBag, string key)
                             {{
                                 T value = default(T);
                                 dataBag.TryGetValue<T>(key, out value);
                                 return value;
                             }}

                             private readonly FormStep _step;
                             private readonly BotConfig _botConfig;
                             public {className}(IBotDataBag dataBag, FormStep step, BotConfig botConfig) {{
                                 {_getStoredFields.ToString()}
                                 {_attachPreviousNlpEntities.ToString()}
                                 _step = step;
                                 _botConfig = botConfig;
                             }}

                            [JsonIgnore]
                             public StateCallBack Callback {{ get; set; }}
                             
                             {_properties.ToString()}

                             public IForm<{className}> BuildForm() {{
                                    INLPService nlpService = null;
                                    if (_step.NLPSettings != null) 
                                    {{
                                        nlpService = Conversation.Container.ResolveKeyed<INLPService>(_step.NLPSettings.ServiceType, new TypedParameter(typeof(Settings), _step.NLPSettings)); 
                                    }}

                                    var fbFactory = new FormBuilderFactory<{className}>(_step);
                                    var fb = fbFactory.Create();
                                    {_formBuilderProperties.ToString()}
                                    
                                    {_summary}
                                    {_saveAnswers}
    
                                    fb.Prompter(async (context, prompt, state, field) => {{
                                        var preamble = context.MakeMessage();
                                        var promptMessage = context.MakeMessage();
                                                        
                                        {_replaceFieldValuesInQuestion}

                                        SpeechSynthesizerManager speechSynthesizerManager = null;
                                        
                                        {_speechSynthesizerCreateInstance}

                                        if (prompt.GenerateMessages(preamble, promptMessage))
                                        {{
                                            if (context.Activity.AsMessageActivity().HasAudioAttachment() && speechSynthesizerManager != null)
                                            {{
                                                var preambleUrl = await speechSynthesizerManager.GetUrlAsync(context.Activity.From.Id, preamble.Text);
                                                preamble.Text = string.Empty;
                                                preamble.MakeAudioCard(preambleUrl);
                                            }}
                                            await context.PostAsync(preamble);
                                        }}

                                        if (context.Activity.AsMessageActivity().HasAudioAttachment())
                                        {{
                                            if (!string.IsNullOrEmpty(promptMessage.Text))
                                            {{
                                                var url = await speechSynthesizerManager.GetUrlAsync(context.Activity.From.Id, promptMessage.Text);
                                                promptMessage.Text = string.Empty;
                                                promptMessage.MakeAudioCard(url);
                                            }}

                                            foreach(var attachment in promptMessage.Attachments)
                                            {{
                                                if (attachment.Content is HeroCard && !string.IsNullOrEmpty((attachment.Content as HeroCard).Text))
                                                {{
                                                    var cardMessage = context.MakeMessage();
                                                    var url = await speechSynthesizerManager.GetUrlAsync(context.Activity.From.Id, (attachment.Content as HeroCard).Text);
                                                    cardMessage.MakeAudioCard(url);
                                                    await context.PostAsync(cardMessage);
                                                }}
                                            }}
                                        }}

                                        await context.PostAsync(promptMessage);

                                        return prompt;
                                    }});

                                    var form = fb.Build();
                                    return form;
                             }}

                             {_saveAnswersMethod}

                             public async Task ResumeAfterInput(IDialogContext context, IAwaitable<{className}> result)
                             {{
                                    try 
                                    {{
                                        var state = await result;
                                        Callback.SetState(context, state, false);
                                    }} 
                                    catch(FormCanceledException) 
                                    {{
                                        Callback.SetState(context, null, true);
                                    }}
                             }}
                        }}
                    }}";

            return CSharpSyntaxTree.ParseText(classText);
        }

        private void GenerateProperty(FormField field, FormStep step)
        {
            GeneratePropertyCustomAttributes(field);

            switch (field.Type)
            {
                case FieldTypes.Number:
                case FieldTypes.Text:
                case FieldTypes.Date:
                case FieldTypes.Time:
                case FieldTypes.Decimal:
                case FieldTypes.CPF:
                case FieldTypes.YesNo:
                    CreateProperty(field);
                    CreateFormBuilderProperty(field);
                    break;
                case FieldTypes.SingleOption:
                    if (string.IsNullOrEmpty(field.OptionsSource))
                    {
                        _enumNamesDictionary.Add(field.Id, $"Enum{++enumCount}");
                        WriteEnum(_enumNamesDictionary[field.Id], field.Options);
                        CreateProperty(field.Name, $"{_enumNamesDictionary[field.Id]}?");
                        CreateFormBuilderProperty(field);
                    }
                    else
                    {
                        CreateProperty(field.Name, $"string");
                        CreateFormBuilderDynamicOptionsProperty(field, step);
                    }
                    break;
                case FieldTypes.ManyOptions:
                    if (string.IsNullOrEmpty(field.OptionsSource))
                    {
                        _enumNamesDictionary.Add(field.Id, $"Enum{++enumCount}");
                        WriteEnum(_enumNamesDictionary[field.Id], field.Options);
                        CreateProperty(field.Name, $"List<{_enumNamesDictionary[field.Id]}>");
                        CreateFormBuilderProperty(field);
                    }
                    else
                    {
                        CreateProperty(field.Name, $"List<string>");
                        CreateFormBuilderDynamicOptionsProperty(field, step);
                    }
                    break;
                case FieldTypes.Restore:
                    CreateProperty(field.Name, "bool");
                    var relatedStoredFields = _storedFields.Where(ff => field.RestoreFields.Contains(ff.Name));
                    foreach (var restoreField in _storedFields.Where(ff => field.RestoreFields.Contains(ff.Name)))
                    {
                        GeneratePreviousProperty(restoreField);
                    }
                    CreateFormBuilderRestoreProperty(field, step);
                    AddReplaceRestoreRelatedFieldsValuesInQuestion(field.Name, _storedFields);
                    break;
                default:
                    break;
            }
        }

        private void AddReplaceRestoreRelatedFieldsValuesInQuestion(string fieldName, IEnumerable<FormField> storedFields)
        {
            var replaceRestoreRelatedFieldsValuesInQuestion = GenerateReplaceRestoreRelatedFieldValuesInQuestion(storedFields);

            if (_replaceFieldValuesInQuestion.Length == 0)
            {
                _replaceFieldValuesInQuestion.AppendLine($"if (field?.Name == \"{fieldName}\") {{ prompt.Prompt = prompt.Prompt{replaceRestoreRelatedFieldsValuesInQuestion}; }}");
            }
            else
            {
                _replaceFieldValuesInQuestion.AppendLine($"else if (field?.Name == \"{fieldName}\") {{ prompt.Prompt = prompt.Prompt{replaceRestoreRelatedFieldsValuesInQuestion}; }}");
            }
        }

        private string GenerateReplaceRestoreRelatedFieldValuesInQuestion(IEnumerable<FormField> storedFields)
        {
            StringBuilder replaces = new StringBuilder();
            foreach (var item in storedFields)
            {
                switch (item.Type)
                {
                    case FieldTypes.Number:
                    case FieldTypes.Text:
                    case FieldTypes.Date:
                    case FieldTypes.Time:
                    case FieldTypes.Decimal:
                    case FieldTypes.YesNo:
                    case FieldTypes.CPF:
                    case FieldTypes.SingleOption:
                        replaces.Append($".Replace(\"#{item.Name}#\", state.Previous{item.Name}?.ToString())");
                        break;
                }
            }

            return replaces.ToString();
        }

        private void GeneratePreviousProperty(FormField field)
        {
            switch (field.Type)
            {
                case FieldTypes.Number:
                case FieldTypes.Text:
                case FieldTypes.Date:
                case FieldTypes.Time:
                case FieldTypes.Decimal:
                case FieldTypes.CPF:
                    CreatePreviousProperty(field);
                    break;
                case FieldTypes.SingleOption:
                    if (string.IsNullOrEmpty(field.OptionsSource))
                    {
                        CreateProperty($"Previous{field.Name}", _enumNamesDictionary[field.Id]);
                    }
                    else
                    {
                        CreateProperty($"Previous{field.Name}", $"string");
                    }
                    break;
                case FieldTypes.ManyOptions:
                    if (string.IsNullOrEmpty(field.OptionsSource))
                    {
                        CreateProperty($"Previous{field.Name}", _enumNamesDictionary[field.Id]);
                    }
                    else
                    {
                        CreateProperty($"Previous{field.Name}", $"List<string>");
                    }
                    break;
                default:
                    break;
            }
        }



        private void CreateFormBuilderRestoreProperty(FormField field, FormStep step)
        {
            var className = $"Step{step.Id}";
            var restoreFieldsCondition = GenerateRetoreFieldsActiveCondition(field);
            var setRestorePreviousFieldsToCurrent = GenerateSetPreviousFieldsToCurrent(field);
            _formBuilderProperties.AppendLine($@"fb.Field(new FieldReflector<{className}>(""{field.Name}"")
                            .SetActive(state =>
                            {{
                                return {restoreFieldsCondition};
                            }})
                            .SetValidate((Step{step.Id} state, object value) =>
                            {{
                                if ((bool)value)
                                {{
                                    {setRestorePreviousFieldsToCurrent}
                                }}
                                return Task.FromResult(new ValidateResult() {{ IsValid = true, Value = value }});
                            }})
                            .SetPrompt(new PromptAttribute(""{field.Question} {{||}}"")));");
        }

        private string GenerateSetPreviousFieldsToCurrent(FormField field)
        {
            StringBuilder stb = new StringBuilder();

            foreach (var item in field.RestoreFields)
            {
                stb.AppendLine($"state.{item} = state.Previous{item};");
            }

            return stb.ToString();
        }

        private string GenerateRetoreFieldsActiveCondition(FormField field)
        {
            StringBuilder stb = new StringBuilder();

            foreach (var item in field.RestoreFields)
            {
                stb.Append($"!string.IsNullOrEmpty(state.Previous{item}?.ToString()) && ");
            }

            foreach (var item in field.RestoreFields)
            {
                stb.Append($"string.IsNullOrEmpty(state.{item}?.ToString()) && ");
            }
            stb.Remove(stb.Length - 3, 3);
            return stb.ToString();
        }

        private void CreateFormBuilderDynamicOptionsProperty(FormField field, FormStep step)
        {
            var className = $"Step{step.Id}";
            var validationLogic = AddValidationLogic(field);
            string activeLogic = AddActiveLogic(field);
            _formBuilderProperties.AppendLine($@"fb.Field(new FieldReflector<{className}>(nameof({field.Name}))
                            .SetType(null)
                            .SetDefine((state, field) =>
                            {{
                                foreach (var item in OptionsSourceClient.GetOptions(""{field.OptionsSource}"", state, _botConfig).OrderBy(x => x.Order))
                                    field
                                        .AddDescription(item.Value, item.Description)
                                        .AddTerms(item.Value, item.Description);
                                return Task.FromResult(true);
                            }})
                            .SetActive((state) => {{
                                {activeLogic}
                                return true;
                            }})
                            .SetValidate(({className} state, object value) =>
                            {{
                                {validationLogic}
                                return Task.FromResult(new ValidateResult() {{ IsValid = true, Value = value }});
                            }})
                            .SetPrompt(new PromptAttribute(""{field.Question} {{||}}"")));");
        }

        private void GeneratePropertyCustomAttributes(FormField field)
        {
            if (field.Optional)
            {
                _properties.AppendLine("[Microsoft.Bot.Builder.FormFlow.OptionalAttribute]");
            }
        }

        private void WriteEnum(string domainName, List<FieldOption> options)
        {
            _enums.Append($"public enum {domainName} {{");

            foreach (var item in options.OrderBy(x => x.Order))
            {
                _enums.Append($" [Describe(\"{item.Description}\")] [Terms(\"{item.Description}\")] {item.Value},");
            }

            string strEnums = _enums.ToString();

            strEnums = strEnums.Substring(0, strEnums.Length - 1);
            _enums.Clear();
            _enums = new StringBuilder(strEnums);

            _enums.Append("}");
        }

        private void CreateFormBuilderProperty(FormField field)
        {
            string validationLogic = AddValidationLogic(field);
            string activeLogic = AddActiveLogic(field);
            if (field.Type == FieldTypes.ManyOptions || field.Type == FieldTypes.SingleOption || field.Type == FieldTypes.YesNo)
            {
                _formBuilderProperties.AppendLine($@"fb.Field(nameof({field.Name}), ""{field.Question} {{||}}"", validate: (state, value) => {{
                    {validationLogic}
                    return Task.FromResult(new ValidateResult() {{ IsValid = true, Value = value }});
                }} , active: (state) => {{
                    {activeLogic}
                    return true;
                }});");
            }
            else
            {
                _formBuilderProperties.AppendLine($@"fb.Field(nameof({field.Name}), ""{field.Question}"", validate: (state, value) => {{
                    {validationLogic}
                    return Task.FromResult(new ValidateResult() {{ IsValid = true, Value = value }});
                }}, active: (state) => {{
                    {activeLogic}
                    return true;
                }});");
            }

        }

        private string AddActiveLogic(FormField field)
        {
            if (string.IsNullOrEmpty(field.ActiveApiURL)) return string.Empty;

            return $@"var active = Validator.ActiveApi(""{field.ActiveApiURL}"", state, _botConfig); return active;";
        }

        private string AddValidationLogic(FormField field)
        {
            StringBuilder validationLogic = new StringBuilder();

            if (field.Type == FieldTypes.CPF)
            {
                validationLogic.Append($@" 
                            if (!Validator.CPF(value.ToString()))
                            {{
                                return Task.FromResult(new ValidateResult() {{ IsValid = false,Feedback = ""{field.ValidationFailedMessage}"" }});
                            }}");
            }
            else if (field.Type == FieldTypes.Date)
            {
                validationLogic.Append($@"value = GrammarUtilities.ParseDate(value.ToString());");
            }
            else if (field.Type == FieldTypes.Time)
            {
                validationLogic.Append($@"value = GrammarUtilities.ParseTime(value.ToString());");
            }

            if (!string.IsNullOrEmpty(field.ValidationApiURL))
            {
                validationLogic.Append($@"  
                             var output = Validator.ValidationApi(""{field.ValidationApiURL}"", state, value, _botConfig);
                             if (!output.Valid)
                             {{
                                 SpeechSynthesizerManager speechSynthesizerManager = null;   
                                 {_speechSynthesizerCreateInstance}
                                 var messages = speechSynthesizerManager == null
                                            ? output.ErrorMessages
                                            : output.SpokenErrorMessages?.Count > 0 
                                                ? output.SpokenErrorMessages
                                                : output.ErrorMessages;

                                 return Task.FromResult(new ValidateResult() {{ IsValid = false,Feedback = messages?.Count > 0 ? messages.GetRandom() : ""{field.ValidationFailedMessage}"" }});
                             }}");
            }
            if (!string.IsNullOrEmpty(field.NlpEntityName))
            {
                validationLogic.Append($@"
                    if (_step.NLPSettings != null) {{
                        var result = nlpService.GetTopScoringResultAsync(value?.ToString()).Result;
                        var entity = result.Entities.FirstOrDefault(x => x.Type.Equals(""{field.NlpEntityName}"", StringComparison.CurrentCultureIgnoreCase));
                        if (entity != null)
                        {{
                            value = entity.Name;
                        }}
                    }}");
            }
            return validationLogic.ToString();
        }

        private string GetFriendlyName(FormField field)
        {
            switch (field.Type)
            {
                case FieldTypes.Number:
                    return "int?";
                case FieldTypes.Text:
                case FieldTypes.CPF:
                    return "string";
                case FieldTypes.Date:
                case FieldTypes.Time:
                    return "DateTime?";
                case FieldTypes.Decimal:
                    return "float?";
                case FieldTypes.YesNo:
                    return "bool?";
                case FieldTypes.SingleOption:
                    return string.IsNullOrWhiteSpace(field.OptionsSource)
                        ? _enumNamesDictionary[field.Id]
                        : "string";
                case FieldTypes.ManyOptions:
                    return string.IsNullOrWhiteSpace(field.OptionsSource)
                       ? _enumNamesDictionary[field.Id]
                       : "List<string>";
                case FieldTypes.Restore:
                    return "bool";
                default:
                    throw new NotSupportedException();
            }
        }

        private void CreateProperty(FormField field)
        {
            if (field.Type == FieldTypes.Date)
            {
                _properties.AppendLine("[Template(TemplateUsage.StatusFormat, \"{&}: {:d}\", FieldCase = CaseNormalization.None)]");
            }
            else if (field.Type == FieldTypes.Time)
            {
                _properties.AppendLine("[Template(TemplateUsage.StatusFormat, \"{&}: {:t}\", FieldCase = CaseNormalization.None)]");
            }
            else if (field.Type == FieldTypes.Decimal)
            {
                _properties.AppendLine("[Template(TemplateUsage.StatusFormat, \"{&}: {:n2}\", FieldCase = CaseNormalization.None)]");

            }
            _properties.AppendLine($"public {GetFriendlyName(field)} {field.Name} {{get;set;}}");

        }

        private void CreatePreviousProperty(FormField field)
        {
            _properties.AppendLine($"public {GetFriendlyName(field)} Previous{field.Name} {{get;set;}}");
        }

        private void CreateProperty(string propertyName, string propertyTypeName)
        {
            _properties.AppendLine($"public {propertyTypeName} {propertyName} {{get;set;}}");
        }
    }
}