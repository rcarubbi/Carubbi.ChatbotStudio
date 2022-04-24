using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Carubbi.BotEditor.Confg.Tests
{
    [TestClass]
    public class FormStepTests : TestBase
    {
        [TestMethod]
        public void SimpleForm()
        {
            var botConfig = new BotConfig()
            {
                Name = "SimpleForm",
                Id = Guid.NewGuid(),
                RootStepId = 1,
                Steps = new List<Step>
                {
                     new FormStep
                     {
                         Id = 1,
                         FormFields = new List<FormField>
                         {
                             new FormField
                             {
                                 Id = 1,
                                 Name = "Nome",
                                 Type = FieldTypes.Text,
                                 Order = 1,
                                 Question = "Qual é o seu nome?"
                             },
                             new FormField
                             {
                                 Id = 2,
                                 Name = "Cpf",
                                 Type = FieldTypes.CPF,
                                 Order = 2,
                                 Question = "Qual o seu CPF?",
                                 ValidationFailedMessage = "Este CPF não é válido, pode digitar novamente?"
                             },
                             new FormField
                             {
                                 Id = 3,
                                 Name = "DataDeNascimento",
                                 Type = FieldTypes.Date,
                                 Question= "Qual sua data de nascimento?",
                                 Order = 3
                             },
                             new FormField
                             {
                                 Id = 4,
                                 Name = "Altura",
                                 Type = FieldTypes.Decimal,
                                 Question = "Quanto você tem de altura?",
                                 Order = 4
                             },
                             new FormField
                             {
                                 Id = 5,
                                 Name = "TipoDeCarroPreferido",
                                 Type = FieldTypes.SingleOption,
                                 Question = "Qual tipo de carro você prefere?",
                                 Order = 5,
                                 Options = new List<FieldOption>
                                 {
                                     new FieldOption
                                     {
                                         Description = "Sedan",
                                         Order = 1,
                                         Value = "Sedan"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Hatch",
                                         Order = 2,
                                         Value = "Hatch"
                                     },
                                     new FieldOption
                                     {
                                         Description = "SUV",
                                         Order = 3,
                                         Value = "SUV"
                                     },
                                 },

                             },
                             new FormField
                             {
                                 Order = 6,
                                 Id = 6,
                                 Name = "Opcionais",
                                 Type = FieldTypes.ManyOptions,
                                 Question = "Quais Opcionais você deseja?",
                                 Options = new List<FieldOption>
                                 {
                                     new FieldOption
                                     {
                                         Description = "Ar Condicionado",
                                         Order = 1,
                                         Value = "ArCondicionado"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Vidro Elétrico",
                                         Order = 2,
                                         Value = "VidorEletrico"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Direção Hidraulica",
                                         Order = 3,
                                         Value = "DirecaoHidraulica"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Banco de couro",
                                         Order = 4,
                                         Value = "BancoCouro"
                                     },
                                 },

                             },
                             new FormField
                             {
                                 Order = 7,
                                 Id = 7,
                                 Type = FieldTypes.Number,
                                 Name = "QuantidadeDeFilhos",
                                 Question = "Quantos filhos você tem?",
                                 Optional = true,
                             },
                             new FormField
                             {
                                 Order = 8,
                                 Id = 8,
                                 Name = "HorarioDaVisita",
                                 Question = "Para qual horário você quer agendar a visita?",
                                 Type = FieldTypes.Time,
                             },
                             new FormField
                             {
                                 Order = 9,
                                 Id = 9,
                                 Type = FieldTypes.YesNo,
                                 Name = "LembretePorEmail",
                                 Question = "Quer receber um lembrete por email?"
                             },
                         },
                     }

                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "SimpleForm.json"), output);
        }

        [TestMethod]
        public void ApiValidationForm()
        {
            var botConfig = new BotConfig()
            {
                SpeechSettings = new SpeechSettings
                {
                    Recognition = new SpeechRecognitionSettings
                    {
                        SubscriptionKey = "c90f63dde7d3473d89531fbe68f89a94",
                        Language = "pt-BR",
                        ServiceRegion = "westus",
                        ServiceType = SpeechRecognitionServiceType.BingSpeech,
                    },
                    Synthesis = new SpeechSynthesisSettings
                    {
                        SubscriptionKey = "c90f63dde7d3473d89531fbe68f89a94",
                        Language = "pt-BR",
                        ServiceRegion = "westus",
                        ServiceType = SpeechSynthesisServiceType.BingSpeech,
                        StoreType = SpeechSynthesisStoreType.FileSystem,
                        CacheType = SpeechSynthesisCacheType.InMemory
                    },
                },
                Name = "ApiValidationForm",
                Id = Guid.NewGuid(),
                RootStepId = 1,
                Steps = new List<Step>
                {
                     new MessageStep
                     {
                         Id = 1,
                         Messages = new MessageInteractions {
                             Typed = new List<string>
                             {
                                 "Oi! Tudo bem? Eu sou um bot de exemplo de formulário... vou te fazer uma série de perguntas e se você tiver dúvidas pode digitar /ajuda a qualquer momento que eu te dou umas dicas okay? Vamos lá..."
                             },
                         },
                         NextStepId = 2,
                     },
                     new FormStep
                     {
                         Id = 2,
                         FormFields = new List<FormField>
                         {
                              new FormField
                             {
                                 Id = 1,
                                 Name = "Nome",
                                 Type = FieldTypes.Text,
                                 Question = "Qual o seu nome?",
                                 Order = 1
                             },
                             new FormField
                             {
                                 Id = 8,
                                 Name = "DataDeNascimento",
                                 Type = FieldTypes.Date,
                                 Question= "Qual sua data de nascimento?",
                                 Order = 8,
                                 ValidationApiURL = "https://carubbiboteditorsamplesapi.azurewebsites.net/api/datanascimentovalidation",
                             },
                         },
                         NextStepId = 3
                     },
                     new ConditionStep
                     {
                         Id = 3,
                         TrueStepId = 4,
                         FalseStepId = 5,
                         ConditionExpression = "@2.Output.FormCancelled == true"
                     },
                     new MessageStep
                     {
                         Id = 4,
                         Messages = new MessageInteractions {
                             Typed = new List<string>
                             {
                                 "Okay, se quiser falar comigo de novo é só chamar"
                             }
                         },
                     },
                     new MessageStep
                     {
                         Id = 5,
                         Messages = new MessageInteractions {
                             Typed = new List<string>
                             {
                                 "Obrigado @ViewBag.Step2.Output.Form.Nome, seu pedido foi enviado"
                             }
                         }
                     }
                     
                },
                AppId = "47cfcd3f-235e-4e42-9c5c-9b7b3d5ba63e",
                AppPassword = "TjbrjI@P5*6oxPgtQn.47+4]l_NXxJpS"
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ApiValidationForm.json"), output);
        }

        [TestMethod]
        public void DynamicFieldsAndOptionsForm()
        {
            var botConfig = new BotConfig()
            {
                SpeechSettings = new SpeechSettings
                {
                    Recognition = new SpeechRecognitionSettings
                    {
                        SubscriptionKey = "c90f63dde7d3473d89531fbe68f89a94",
                        Language = "pt-BR",
                        ServiceRegion = "westus",
                        ServiceType = SpeechRecognitionServiceType.BingSpeech,
                    },
                    Synthesis = new SpeechSynthesisSettings
                    {
                        SubscriptionKey = "c90f63dde7d3473d89531fbe68f89a94",
                        Language = "pt-BR",
                        ServiceRegion = "westus",
                        ServiceType = SpeechSynthesisServiceType.BingSpeech,
                        StoreType = SpeechSynthesisStoreType.FileSystem,
                        CacheType = SpeechSynthesisCacheType.InMemory
                    },
                },
                Name = "DynamicFieldsAndOptionsForm",
                Id = Guid.NewGuid(),
                RootStepId = 1,
                Steps = new List<Step>
                {
                     new MessageStep
                     {
                         Id = 1,
                         Messages = new MessageInteractions {
                             Typed = new List<string>
                             {
                                 "Oi! Tudo bem? Eu sou um bot de exemplo de formulário... vou te fazer uma série de perguntas e se você tiver dúvidas pode digitar /ajuda a qualquer momento que eu te dou umas dicas okay? Vamos lá..."
                             }
                         },
                         NextStepId = 2,
                     },
                     new FormStep
                     {
                         Id = 2,
                         FormFields = new List<FormField>
                         {
                              new FormField
                             {
                                 Id = 1,
                                 Name = "Nome",
                                 Type = FieldTypes.Text,
                                 Question = "Qual o seu nome?",
                                 Order = 1
                             },
                             new FormField
                             {
                                 Id = 3,
                                 Name = "TipoDeCarroPreferido",
                                 Type = FieldTypes.SingleOption,
                                 Question = "Qual tipo de carro você prefere?",
                                 Order = 3,
                                 Options = new List<FieldOption>
                                 {
                                     new FieldOption
                                     {
                                         Description = "Sedan",
                                         Order = 1,
                                         Value = "Sedan"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Hatch",
                                         Order = 2,
                                         Value = "Hatch"
                                     },
                                     new FieldOption
                                     {
                                         Description = "SUV",
                                         Order = 3,
                                         Value = "SUV"
                                     },
                                 },

                             },
                             new FormField
                             {
                                 ActiveApiURL = "https://carubbiboteditorsamplesapi.azurewebsites.net/api/opcionaisactive",
                                 Order = 4,
                                 Id = 4,
                                 Name = "Opcionais",
                                 Type = FieldTypes.ManyOptions,
                                 Question = "Quais Opcionais você deseja?",
                                 Options = new List<FieldOption>
                                 {
                                     new FieldOption
                                     {
                                         Description = "Ar Condicionado",
                                         Order = 1,
                                         Value = "ArCondicionado"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Vidro Elétrico",
                                         Order = 2,
                                         Value = "VidorEletrico"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Direção Hidraulica",
                                         Order = 3,
                                         Value = "DirecaoHidraulica"
                                     },
                                     new FieldOption
                                     {
                                         Description = "Banco de couro",
                                         Order = 4,
                                         Value = "BancoCouro"
                                     },
                                 },
                             },
                             new FormField
                             {
                                 ActiveApiURL = "https://carubbiboteditorsamplesapi.azurewebsites.net/api/suvopcionaisactive",
                                 Order = 5,
                                 Id = 5,
                                 Name = "OpcionaisDeSUV",
                                 Type = FieldTypes.ManyOptions,
                                 Question = "Quais Opcionais você deseja?",
                                 OptionsSource = "https://carubbiboteditorsamplesapi.azurewebsites.net/api/suvoptionssource"
                             },
                         },
                         NextStepId = 3
                     },
                     new ConditionStep
                     {
                         Id = 3,
                         TrueStepId = 4,
                         FalseStepId = 5,
                         ConditionExpression = "@2.Output.FormCancelled == true"
                     },
                     new MessageStep
                     {
                         Id = 4,
                         Messages = new MessageInteractions {
                             Typed = new List<string>
                             {
                                 "Okay, se quiser falar comigo de novo é só chamar"
                             }
                         }
                     },
                     new MessageStep
                     {
                         Id = 5,
                         Messages = new MessageInteractions {
                             Typed = new List<string>
                             {
                                 "Obrigado @ViewBag.Step2.Output.Form.Nome, seu pedido foi enviado",
                             }
                         },
                     }

                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "DynamicFieldsAndOptionsForm.json"), output);
        }
    }
}
