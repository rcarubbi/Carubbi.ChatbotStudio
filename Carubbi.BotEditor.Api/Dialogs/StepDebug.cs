
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

 

namespace CineBot
{
    public enum Enum1 { [Describe("Pipoca")][Terms("Pipoca")] Pipoca = 1, [Describe("Chocolate")][Terms("Chocolate")] Chocolate = 2, [Describe("Refrigerante")][Terms("Refrigerante")] Refrigerante = 3, [Describe("Bala")][Terms("Bala")] Bala = 4 }
    public enum Enum2 { [Describe("Entrada Inteira")][Terms("Entrada Inteira")] Inteira = 1, [Describe("Meia entrada")][Terms("Meia entrada")] Meia = 2 }


    [Serializable]
    public class Step1
    {
        protected T GetValue<T>(IBotDataBag dataBag, string key)
        {
            string value = default(string);
            dataBag.TryGetValue(key, out value);

            return string.IsNullOrWhiteSpace(value)
                 ? default(T)
                 : JsonConvert.DeserializeObject<T>(value);
        }

        private readonly FormStep _step;
        private readonly BotConfig _botConfig;
        public Step1(IBotDataBag dataBag, FormStep step, BotConfig botConfig)
        {
            PreviousNome = GetValue<string>(dataBag, "Nome|2");
            var dateTimeParsePreviousDataNascimentoSuccess = DateTime.TryParse(GetValue<string>(dataBag, "DataNascimento|3"), out var parsedPreviousDataNascimento);
            if (dateTimeParsePreviousDataNascimentoSuccess) { PreviousDataNascimento = parsedPreviousDataNascimento; }
            PreviousOpcionais = GetValue<List<Enum1>>(dataBag, "Opcionais|4");
            PreviousTipoIngresso = GetValue<Enum2?>(dataBag, "TipoIngresso|5");
            PreviousServicoParceiro = GetValue<string>(dataBag, "ServicoParceiro|6");
            PreviousServicoParceiroMultiplo = GetValue<List<string>>(dataBag, "ServicoParceiroMultiplo|7");

            ReutilizarRespostas = GetValue<bool?>(dataBag, "Entity|ReutilizarRespostas|1");
            Nome = GetValue<string>(dataBag, "Entity|Nome|2");
            var dateTimeParseDataNascimentoSuccess = DateTime.TryParse(GetValue<string>(dataBag, "Entity|DataNascimento|3"), out var parsedDataNascimento);
            if (dateTimeParseDataNascimentoSuccess) { DataNascimento = parsedDataNascimento; }
            Opcionais = GetValue<List<Enum1>>(dataBag, "Entity|Opcionais|4");
            TipoIngresso = GetValue<Enum2?>(dataBag, "Entity|TipoIngresso|5");
            ServicoParceiro = GetValue<string>(dataBag, "Entity|ServicoParceiro|6");
            ServicoParceiroMultiplo = GetValue<List<string>>(dataBag, "Entity|ServicoParceiroMultiplo|7");

            _step = step;
            _botConfig = botConfig;
        }

        [JsonIgnore]
        public StateCallBack Callback { get; set; }

        public bool? ReutilizarRespostas { get; set; }
        public string PreviousNome { get; set; }
        public DateTime? PreviousDataNascimento { get; set; }
        public List<Enum1> PreviousOpcionais { get; set; }
        public Enum2? PreviousTipoIngresso { get; set; }
        public string PreviousServicoParceiro { get; set; }
        public List<string> PreviousServicoParceiroMultiplo { get; set; }
        public string Nome { get; set; }
        [Template(TemplateUsage.StatusFormat, "{&}: {:d}", FieldCase = CaseNormalization.None)]
        public DateTime? DataNascimento { get; set; }
        [Microsoft.Bot.Builder.FormFlow.OptionalAttribute]
        public List<Enum1> Opcionais { get; set; }
        public Enum2? TipoIngresso { get; set; }
        [Microsoft.Bot.Builder.FormFlow.OptionalAttribute]
        public string ServicoParceiro { get; set; }
        [Microsoft.Bot.Builder.FormFlow.OptionalAttribute]
        public List<string> ServicoParceiroMultiplo { get; set; }


        public IForm<Step1> BuildForm()
        {
            INLPService nlpService = null;
            if (_step.NLPSettings != null)
            {
                nlpService = Conversation.Container.ResolveKeyed<INLPService>(_step.NLPSettings.ServiceType, new TypedParameter(typeof(Settings), _step.NLPSettings));
            }

            var fbFactory = new FormBuilderFactory<Step1>(_step);
            var fb = fbFactory.Create();
            fb.Field(new FieldReflector<Step1>("ReutilizarRespostas")
    .SetActive(state =>
    {
        return !string.IsNullOrEmpty(state.PreviousNome?.ToString()) || !string.IsNullOrEmpty(state.PreviousDataNascimento?.ToString()) || !string.IsNullOrEmpty(state.PreviousTipoIngresso?.ToString()) || !string.IsNullOrEmpty(state.PreviousOpcionais?.ToString()) || !string.IsNullOrEmpty(state.PreviousServicoParceiro?.ToString()) || !string.IsNullOrEmpty(state.PreviousServicoParceiroMultiplo?.ToString());
    })
    .SetValidate((Step1 state, object value) =>
    {
        if ((bool)value)
        {
            if (state.Nome == null) { state.Nome = state.PreviousNome; }
            if (state.DataNascimento == null) { state.DataNascimento = state.PreviousDataNascimento; }
            if (state.TipoIngresso == null) { state.TipoIngresso = state.PreviousTipoIngresso; }
            if (state.Opcionais == null) { state.Opcionais = state.PreviousOpcionais; }
            if (state.ServicoParceiro == null) { state.ServicoParceiro = state.PreviousServicoParceiro; }
            if (state.ServicoParceiroMultiplo == null) { state.ServicoParceiroMultiplo = state.PreviousServicoParceiroMultiplo; }

        }
        return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
    })
    .SetPrompt(new PromptAttribute("#Nome#, você quer reutilizar as respostas anteriores? {||}")));
            fb.Field(nameof(Nome), "Qual o seu nome?", validate: (state, value) => {

                if (_step.NLPSettings != null)
                {
                    var result = nlpService.GetTopScoringResultAsync(value?.ToString()).Result;
                    var entity = result.Entities.FirstOrDefault(x => x.Type.Equals("Nome", StringComparison.CurrentCultureIgnoreCase));
                    if (entity != null)
                    {
                        value = entity.Name;
                    }
                }
                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });
            fb.Field(nameof(DataNascimento), "Qual sua data de nascimento?", validate: (state, value) => {
                value = GrammarUtilities.ParseDate(value.ToString());
                if (_step.NLPSettings != null)
                {
                    var result = nlpService.GetTopScoringResultAsync(value?.ToString()).Result;
                    var entity = result.Entities.FirstOrDefault(x => x.Type.Equals("DataNascimento", StringComparison.CurrentCultureIgnoreCase));
                    if (entity != null)
                    {
                        value = entity.Name;
                    }
                }
                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });
            fb.Field(nameof(Opcionais), "Deseja adquirir um desses items? {||}", validate: (state, value) => {

                if (_step.NLPSettings != null)
                {
                    var result = nlpService.GetTopScoringResultAsync(value?.ToString()).Result;
                    var entity = result.Entities.FirstOrDefault(x => x.Type.Equals("Opcionais", StringComparison.CurrentCultureIgnoreCase));
                    if (entity != null)
                    {
                        value = entity.Name;
                    }
                }
                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });
            fb.Field(nameof(TipoIngresso), "Qual o tipo de ingresso? {||}", validate: (state, value) => {

                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });
            fb.Field(new FieldReflector<Step1>(nameof(ServicoParceiro))
                                        .SetType(null)
                                        .SetDefine((state, field) =>
                                        {
                                            foreach (var item in OptionsSourceClient.GetOptions("https://localhost:44325/api/SUVOptionsSource", state, _botConfig).OrderBy(x => x.Order))
                                                field
                                                    .AddDescription(item.Value, item.Description)
                                                    .AddTerms(item.Value, item.Description);
                                            return Task.FromResult(true);
                                        })
                                        .SetActive((state) => {

                                            return true;
                                        })
                                        .SetValidate((Step1 state, object value) =>
                                        {

                                            if (_step.NLPSettings != null)
                                            {
                                                var result = nlpService.GetTopScoringResultAsync(value?.ToString()).Result;
                                                var entity = result.Entities.FirstOrDefault(x => x.Type.Equals("ServicoParceiro", StringComparison.CurrentCultureIgnoreCase));
                                                if (entity != null)
                                                {
                                                    value = entity.Name;
                                                }
                                            }
                                            return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
                                        })
                                        .SetPrompt(new PromptAttribute("Deseja adquirir um serviço de parceiro? {||}")));
            fb.Field(new FieldReflector<Step1>(nameof(ServicoParceiroMultiplo))
                                        .SetType(null)
                                        .SetDefine((state, field) =>
                                        {
                                            foreach (var item in OptionsSourceClient.GetOptions("https://localhost:44325/api/SUVOptionsSource", state, _botConfig).OrderBy(x => x.Order))
                                                field
                                                    .AddDescription(item.Value, item.Description)
                                                    .AddTerms(item.Value, item.Description);
                                            return Task.FromResult(true);
                                        })
                                        .SetActive((state) => {

                                            return true;
                                        })
                                        .SetValidate((Step1 state, object value) =>
                                        {

                                            return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
                                        })
                                        .SetPrompt(new PromptAttribute("Deseja adquirir mais serviços do parceiro? {||}")));


            fb.Confirm("{*} As informações estão corretas? {||}");
            fb.OnCompletion(SaveAnswers);

            fb.Prompter(async (context, prompt, state, field) => {
                var preamble = context.MakeMessage();
                var promptMessage = context.MakeMessage();

                if (field?.Name == "ReutilizarRespostas") { prompt.Prompt = prompt.Prompt.Replace("#Nome#", state.PreviousNome?.ToString()).Replace("#DataNascimento#", state.PreviousDataNascimento?.ToString()).Replace("#TipoIngresso#", state.PreviousTipoIngresso?.ToString()).Replace("#ServicoParceiro#", state.PreviousServicoParceiro?.ToString()); }


                SpeechSynthesizerManager speechSynthesizerManager = null;

                speechSynthesizerManager = Conversation.Container.Resolve<SpeechSynthesizerManager>();

                if (prompt.GenerateMessages(preamble, promptMessage))
                {
                    if (context.Activity.AsMessageActivity().HasAudioAttachment() && speechSynthesizerManager != null)
                    {
                        var preambleUrl = await speechSynthesizerManager.GetUrlAsync(context.Activity.From.Id, preamble.Text);
                        preamble.Text = string.Empty;
                        preamble.MakeAudioCard(preambleUrl);
                    }
                    await context.PostAsync(preamble);
                }

                if (context.Activity.AsMessageActivity().HasAudioAttachment())
                {
                    if (!string.IsNullOrEmpty(promptMessage.Text))
                    {
                        var url = await speechSynthesizerManager.GetUrlAsync(context.Activity.From.Id, promptMessage.Text);
                        promptMessage.Text = string.Empty;
                        promptMessage.MakeAudioCard(url);
                    }

                    foreach (var attachment in promptMessage.Attachments)
                    {
                        if (attachment.Content is HeroCard && !string.IsNullOrEmpty((attachment.Content as HeroCard).Text))
                        {
                            var cardMessage = context.MakeMessage();
                            var url = await speechSynthesizerManager.GetUrlAsync(context.Activity.From.Id, (attachment.Content as HeroCard).Text);
                            cardMessage.MakeAudioCard(url);
                            await context.PostAsync(cardMessage);
                        }
                    }
                }

                await context.PostAsync(promptMessage);

                return prompt;
            });

            var form = fb.Build();
            return form;
        }

        private Task SaveAnswers(IDialogContext context, object state)
        {
            var currentPropertyValues = new Dictionary<string, string>();

            currentPropertyValues.Add("Nome|2", Nome?.ToString());
            currentPropertyValues.Add("DataNascimento|3", DataNascimento?.ToString());
            currentPropertyValues.Add("Opcionais|4", Opcionais?.ToString());
            currentPropertyValues.Add("TipoIngresso|5", TipoIngresso?.ToString());
            currentPropertyValues.Add("ServicoParceiro|6", ServicoParceiro?.ToString());
            currentPropertyValues.Add("ServicoParceiroMultiplo|7", ServicoParceiroMultiplo?.ToString());


            foreach (KeyValuePair<string, string> kvp in currentPropertyValues)
            {
                var stateValue = JsonConvert.SerializeObject(state.GetType().GetProperty(kvp.Key.Split('|')[0]).GetValue(state));
                context.UserData.SetValue(kvp.Key, stateValue);
            }

            return Task.CompletedTask;
        }

        public async Task ResumeAfterInput(IDialogContext context, IAwaitable<Step1> result)
        {
            try
            {
                var state = await result;
                Callback.SetState(context, state, false);
            }
            catch (FormCanceledException)
            {
                Callback.SetState(context, null, true);
            }
        }
    }
}