
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

 

namespace VoiceBot
{
    public enum Enum1 { [Describe("Entrada Inteira")][Terms("Entrada Inteira")] Inteira, [Describe("Meia entrada")][Terms("Meia entrada")] Meia }


    [Serializable]
    public class Step1
    {
        protected T GetValue<T>(IBotDataBag dataBag, string key)
        {
            T value = default(T);
            dataBag.TryGetValue<T>(key, out value);
            return value;
        }

        private readonly FormStep _step;
        private readonly BotConfig _botConfig;
        public Step1(IBotDataBag dataBag, FormStep step, BotConfig botConfig)
        {
            PreviousNome = GetValue<string>(dataBag, "Nome|2");
            var dateTimeParsePreviousDataNascimentoSuccess = DateTime.TryParse(GetValue<string>(dataBag, "DataNascimento|3"), out var parsedPreviousDataNascimento);
            if (dateTimeParsePreviousDataNascimentoSuccess) { PreviousDataNascimento = parsedPreviousDataNascimento; }

            ReutilizarRespostas = GetValue<bool>(dataBag, "Entity|ReutilizarRespostas|1");
            Nome = GetValue<string>(dataBag, "Entity|Nome|2");
            var dateTimeParseDataNascimentoSuccess = DateTime.TryParse(GetValue<string>(dataBag, "Entity|DataNascimento|3"), out var parsedDataNascimento);
            if (dateTimeParseDataNascimentoSuccess) { DataNascimento = parsedDataNascimento; }
            TipoIngresso = GetValue<Enum1>(dataBag, "Entity|TipoIngresso|4");

            _step = step;
            _botConfig = botConfig;
        }

        [JsonIgnore]
        public StateCallBack Callback { get; set; }

        public bool ReutilizarRespostas { get; set; }
        public string PreviousNome { get; set; }
        public DateTime? PreviousDataNascimento { get; set; }
        public string Nome { get; set; }
        [Template(TemplateUsage.StatusFormat, "{&}: {:d}", FieldCase = CaseNormalization.None)]
        public DateTime? DataNascimento { get; set; }
        public Enum1? TipoIngresso { get; set; }


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
        return !string.IsNullOrEmpty(state.PreviousNome?.ToString()) && !string.IsNullOrEmpty(state.PreviousDataNascimento?.ToString()) && string.IsNullOrEmpty(state.Nome?.ToString()) && string.IsNullOrEmpty(state.DataNascimento?.ToString());
    })
    .SetValidate((Step1 state, object value) =>
    {
        if ((bool)value)
        {
            state.Nome = state.PreviousNome;
            state.DataNascimento = state.PreviousDataNascimento;

        }
        return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
    })
    .SetPrompt(new PromptAttribute("Quer reutilizar as respostas anteriores? {||}")));
            fb.Field(nameof(Nome), "Qual o seu nome?", validate: (state, value) => {

                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });
            fb.Field(nameof(DataNascimento), "Qual sua data de nascimento?", validate: (state, value) => {
                value = GrammarUtilities.ParseDate(value.ToString());
                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });
            fb.Field(nameof(TipoIngresso), "Qual o tipo de ingresso? {||}", validate: (state, value) => {

                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });


            fb.Confirm("{*} As informações estão corretas? {||}");
            fb.OnCompletion(SaveAnswers);

            fb.Prompter(async (context, prompt, state, field) => {
                var preamble = context.MakeMessage();
                var promptMessage = context.MakeMessage();

                if (field?.Name == "ReutilizarRespostas") { prompt.Prompt = prompt.Prompt.Replace("#Nome#", state.PreviousNome?.ToString()).Replace("#DataNascimento#", state.PreviousDataNascimento?.ToString()); }


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


            foreach (KeyValuePair<string, string> kvp in currentPropertyValues)
            {
                context.UserData.SetValue(kvp.Key, state.GetType().GetProperty(kvp.Key.Split('|')[0]).GetValue(state).ToString());
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