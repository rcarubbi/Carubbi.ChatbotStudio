
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

namespace Showroom
{
    public enum Enum1 {[Describe("Finançeiro")] [Terms("Finançeiro")] Financeiro, [Describe("Insatisfação")] [Terms("Insatisfação")] Insatisfacao, [Describe("Rede Credenciada")] [Terms("Rede Credenciada")] RedeCredenciada }


    [Serializable]
    public class Step2
    {
        protected T GetValue<T>(IBotDataBag dataBag, string key)
        {
            T value = default(T);
            dataBag.TryGetValue<T>(key, out value);
            return value;
        }

        private readonly FormStep _step;
        private readonly BotConfig _botConfig;
        public Step2(IBotDataBag dataBag, FormStep step, BotConfig botConfig)
        {

            Cpf = GetValue<string>(dataBag, "Entity|Cpf|1");
            Dependente = GetValue<string>(dataBag, "Entity|Dependente|2");
            Plano = GetValue<string>(dataBag, "Entity|Plano|3");
            Motivo = GetValue<Enum1?>(dataBag, "Entity|Motivo|4");

            _step = step;
            _botConfig = botConfig;
        }

        [JsonIgnore]
        public StateCallBack Callback { get; set; }

        public string Cpf { get; set; }
        public string Dependente { get; set; }
        public string Plano { get; set; }
        public Enum1? Motivo { get; set; }


        public IForm<Step2> BuildForm()
        {
            INLPService nlpService = null;
            if (_step.NLPSettings != null)
            {
                nlpService = Conversation.Container.ResolveKeyed<INLPService>(_step.NLPSettings.ServiceType, new TypedParameter(typeof(Settings), _step.NLPSettings));
            }

            var fbFactory = new FormBuilderFactory<Step2>(_step);
            var fb = fbFactory.Create();
            fb.Field(nameof(Cpf), "Agora me informe qual dependente deseja cancelar?", validate: (state, value) => {

                if (!Validator.CPF(value.ToString()))
                {
                    return Task.FromResult(new ValidateResult() { IsValid = false, Feedback = "Ops, algo de errado com os dados, vamos tentar novamente!" });
                }
                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });
            fb.Field(new FieldReflector<Step2>(nameof(Dependente))
                                        .SetType(null)
                                        .SetDefine((state, field) =>
                                        {
                                            foreach (var item in OptionsSourceClient.GetOptions("https://localhost:44325/api/ShowroomListarDependentes", state, _botConfig).OrderBy(x => x.Order))
                                                field
                                                    .AddDescription(item.Value, item.Description)
                                                    .AddTerms(item.Value, item.Description);
                                            return Task.FromResult(true);
                                        })
                                        .SetActive((state) => {

                                            return true;
                                        })
                                        .SetValidate((Step2 state, object value) =>
                                        {

                                            return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
                                        })
                                        .SetPrompt(new PromptAttribute("Agora me informe qual dependente deseja cancelar? {||}")));
            fb.Field(new FieldReflector<Step2>(nameof(Plano))
                                        .SetType(null)
                                        .SetDefine((state, field) =>
                                        {
                                            foreach (var item in OptionsSourceClient.GetOptions("https://localhost:44325/api/showroomlistarplanos", state, _botConfig).OrderBy(x => x.Order))
                                                field
                                                    .AddDescription(item.Value, item.Description)
                                                    .AddTerms(item.Value, item.Description);
                                            return Task.FromResult(true);
                                        })
                                        .SetActive((state) => {

                                            return true;
                                        })
                                        .SetValidate((Step2 state, object value) =>
                                        {

                                            return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
                                        })
                                        .SetPrompt(new PromptAttribute("Qual plano deseja cancelar? {||}")));
            fb.Field(nameof(Motivo), "Qual o motivo do cancelamento? {||}", validate: (state, value) => {

                return Task.FromResult(new ValidateResult() { IsValid = true, Value = value });
            }, active: (state) => {

                return true;
            });





            fb.Prompter(async (context, prompt, state, field) => {
                var preamble = context.MakeMessage();
                var promptMessage = context.MakeMessage();



                SpeechSynthesizerManager speechSynthesizerManager = null;



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



        public async Task ResumeAfterInput(IDialogContext context, IAwaitable<Step2> result)
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