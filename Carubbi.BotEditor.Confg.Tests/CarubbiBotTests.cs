using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Config.WebApiIntegration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Carubbi.BotEditor.Confg.Tests
{
    [TestClass]
    public class CarubbiBotTests : TestBase
    {
        [TestMethod]
        public void GenerateCarubbi()
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
                        VoiceName = "pt-BR-Daniel-Apollo",
                        SubscriptionKey = "c90f63dde7d3473d89531fbe68f89a94",
                        Language = "pt-BR",
                        ServiceRegion = "westus",
                        ServiceType = SpeechSynthesisServiceType.BingSpeech,
                        StoreType = SpeechSynthesisStoreType.FileSystem,
                        CacheType = SpeechSynthesisCacheType.InMemory
                    },
                },
                Id = Guid.NewGuid(),
                Name = "Carubbi",
                CustomCommands = new List<CustomCommandConfig>
                {
                    new CustomCommandConfig
                    {
                        CommandText = "/reiniciar",
                        ClearDialogStack = true,
                        CustomMessageReply = "Certo, vamos recomeçar do zero",
                        DeleteProfile = true
                    },
                    new CustomCommandConfig
                    {
                        CommandText = "/start",
                        Startup = true,
                    }
                },
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new MessageStep
                    {
                        Id = 1,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                        {
                            "Olá",
                            "Oi",
                            "Opa",
                        },
                            Spoken = new List<string>
                        {
                            "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Oi, <prosody contour=\"(25%,+30Hz) (40%,-30%) (80%,+110%)\">Como você está?</prosody></voice></speak>",
                            "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Olá, <prosody contour=\"(25%,+30Hz) (70%,-30%) (80%,+110%)\">em que posso te ajudar hoje?</prosody></voice></speak>",
                            "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Opa, <prosody contour=\"(40%,-30Hz) (98%,+30Hz)\">Tudo bem?</prosody></voice></speak>"
                        },
                        },
                        NextStepId = 2
                    },
                    new ConfirmStep
                    {
                        Id = 2,
                        Question = new MessageInteractions {
                            Typed = new List<string> { "Você gostou deste bot?" },
                            Spoken = new List<string> { "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\"><prosody contour=\"(25%,+30Hz) (40%,-30%) (80%,+90%)\">Você gostou dêste Bóte?</prosody></voice></speak>" },
                        },
                        NoAcceptedAnswers = new string [] {"não", "nah", "mais ou menos", "não muito" },
                        YesAcceptedAnswers = new string[] {  "sim", "gostei", "é bem legal", "eu curti", "é bacana" },
                        FalseStepId = 4,
                        TrueStepId = 3
                    },
                    new MessageStep
                    {
                        Id = 3,
                        Messages = new MessageInteractions
                        {
                            Typed = new List<string>
                            {
                                "Você respondeu @(ViewBag.Step2.Output == null ? \"Nada\" : ViewBag.Step2.Output.Answer)"
                            }
                        },
                        NextStepId = 2
                    },
                    new ListStep
                    {
                        Id =  4,
                        Input = new List<ListItem>
                        {
                            new ListItem
                            {
                                Title = "Ver endereços",
                                TargetStepId = 5,
                            },
                            new ListItem
                            {
                                Title = "Enviar um email",
                                TargetStepId = 6,
                            },
                            new ListItem
                            {
                                Title = "Visitar nosso site",
                                Action = ItemActions.OpenURL,
                                ButtonValue = "http://www.carubbi.com"
                            },
                        },
                        PromptMessage = new MessageInteractions {
                            Typed = new List<string> {
                                "Então como quer entrar em contato com a gente?"
                            },
                            Spoken = new List<string> {
                                "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Então <prosody contour=\"(5%,+30Hz) (40%,-30%)\">como quer entrar em contato com a gente?</prosody></voice></speak>"
                            }
                        },
                        ListType = ListTypes.ButtonList,
                    },
                    new CompositeStep
                    {
                        Id = 5,
                        Name = "Show Maps",
                        RootStepId = 8,
                        NextStepId = 1,
                        Steps = new List<Step>
                        {
                            new ApiStep
                            {
                                Id = 8,
                                ApiURL = "https://carubbiboteditorsamplesapi.azurewebsites.net/api",
                                Verb = HttpVerb.GET,
                                NextStepId = 9,
                                Resource = "location"
                            },
                            new MapsStep
                            {
                                Id = 9,
                                DataSourceExpression = "@8.Output",
                                Input = new List<LocationSource> {
                                    new LocationSource {
                                        Address = "@DataSource.Endereco",
                                        Id = "@DataSource.Id",
                                        Latitude = "@DataSource.Latitude",
                                        Longitude = "@DataSource.Longitude",
                                        City = "@DataSource.Cidade",
                                        Name = "@DataSource.Nome",
                                        State = "@DataSource.UF",
                                        ZipCode = "@DataSource.Cep",
                                    }
                                },
                                ServiceType = MapsServiceType.BingMaps,
                                ApiKey = "AssWuoCfzr3Bj3VCRW_MBhW8t8muASrD72l-o40xQabBBDWqAr4-pybu9Ki8FSr6",
                                Selectable = true,
                            }
                        }
                    },
                    new FormStep
                    {
                        Id = 6,
                        NextStepId = 1,
                        FormFields = new List<FormField>
                        {
                            new FormField
                            {
                                 Id = 1,
                                 Name = "Nome",
                                 Question = "Por favor informe seu nome",
                                 Type = FieldTypes.Text,
                                 Optional = false
                            },
                            new FormField
                            {
                                Id = 2,
                                Name = "Idade",
                                Question = "Qual sua idade?",
                                Type = FieldTypes.Number,
                            },
                        },
                        ShowSummary = true,
                        IncludeConfirmationButtonsOnSummary = true,
                        IncludeFieldListOnSummary = true
                    },
                },
                AppId = "f12a0175-1722-449f-a190-6506aaaed04b",
                AppPassword = "777JFXEGer1bWehi:q?nFuZnyGQ-DzG.",
                PersistenceStrategy = PersistenceStrategies.AzureTables,
                ConnectionString = "DefaultEndpointsProtocol=https;AccountName=carubbiboteditorapi;AccountKey=csp3AaBDt10vBEB4vAPbdaotprAYyW8SPngUwv1ajnW0MxHtZS9rtD1gl7BLWqKA1n3VGKql9I7nZn1aJE4KKw==",
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "carubbi.json"), output);

        }


        [TestMethod]
        public void GenerateCarubbiNlp()
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
                Id = Guid.NewGuid(),
                Name = "CarubbiNlp",
                CustomCommands = new List<CustomCommandConfig>
                {
                    new CustomCommandConfig
                    {
                        CommandText = "/reiniciar",
                        ClearDialogStack = true,
                        CustomMessageReply = "Certo, vamos recomeçar do zero",
                        DeleteProfile = true
                    },
                    new CustomCommandConfig
                    {
                        CommandText = "/start",
                        Startup = true,
                        CustomMessageReply = "",
                    }
                },
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new MessageStep
                    {
                        Id = 1,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Olá",
                                "Oi",
                                "Opa",
                            },
                            Spoken = new List<string>
                            {
                                "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Oi, <prosody contour=\"(25%,+30Hz) (40%,-30%) (80%,+110%)\">Como você está?</prosody></voice></speak>",
                                "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Olá, <prosody contour=\"(25%,+30Hz) (70%,-30%) (80%,+110%)\">em que posso te ajudar hoje?</prosody></voice></speak>",
                                "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Opa, <prosody contour=\"(40%,-30Hz) (98%,+30Hz)\">Tudo bem?</prosody></voice></speak>"
                            },
                        },
                        NextStepId = 2
                    },
                    new ConfirmStep
                    {
                        Id = 2,
                        Question = new MessageInteractions {
                            Typed = new List<string> { "Você gostou deste bot?" },
                            Spoken = new List<string> { "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\"><prosody contour=\"(25%,+30Hz) (40%,-30%) (80%,+90%)\">Você gostou dêste Bóte?</prosody></voice></speak>" },
                        },
                        NoAcceptedAnswers = new string [] {"não", "nah", "mais ou menos", "não muito" },
                        YesAcceptedAnswers = new string[] {  "sim", "gostei", "é bem legal", "eu curti", "é bacana" },
                        FalseStepId = 4,
                        TrueStepId = 3
                    },
                    new MessageStep
                    {
                        Id = 3,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Você respondeu @(ViewBag.Step2.Output == null ? \"Nada\" : ViewBag.Step2.Output.Answer)"
                            }
                        },
                    },
                    new ListStep
                    {
                        NLPSettings = new Config.NLP.Settings
                        {
                            ServiceType = NlpServiceType.Luis,
                            Models = new List<Config.NLP.Model>
                            {
                                new Config.NLP.Model
                                {
                                    AppId = "02f75d97-3b07-451b-a5bd-1707fbaa6983",
                                    Endpoint = "https://nlpinput.cognitiveservices.azure.com",
                                    EndpointPredictionKey = "21821c94a2774e12a4fd43dcd2c3fe6c"
                                }
                            }
                        },
                        Id =  4,
                        Input = new List<ListItem>
                        {
                            new ListItem
                            {
                                ButtonTitle = "Ver endereços",
                                ButtonValue = "Ver endereços",
                                TargetStepId = 5,
                            },
                            new ListItem
                            {
                                ButtonTitle = "Enviar um email",
                                ButtonValue = "Enviar um email",
                                TargetStepId = 6,
                            },
                            new ListItem
                            {
                                ButtonTitle = "Visitar nosso site",
                                ButtonValue = "Http://www.carubbi.com",
                                Action = ItemActions.OpenURL,
                            },
                        },
                        PromptMessage = new MessageInteractions {
                            Typed = new List<string> { "Então como quer entrar em contato com a gente?" },
                            Spoken = new List<string> {
                                "<speak version=\"1.0\" xmlns=\"https://www.w3.org/2001/10/synthesis\" xml:lang=\"pt-BR\"><voice name=\"pt-BR-HeloisaRUS\">Então <prosody contour=\"(5%,+30Hz) (40%,-30%)\">como quer entrar em contato com a gente?</prosody></voice></speak>"
                            },
                        },
                            ListType = ListTypes.ButtonList,
                    },
                    new CompositeStep
                    {
                        Id = 5,
                        Name = "Show Maps",
                        RootStepId = 8,
                        Steps = new List<Step>
                        {
                            new ApiStep
                            {
                                Id = 8,
                                ApiURL = "https://carubbiboteditorsamplesapi.azurewebsites.net/api",
                                Verb = HttpVerb.GET,
                                NextStepId = 9,
                                Resource = "location"
                            },
                            new MapsStep
                            {
                                Id = 9,
                                DataSourceExpression = "@8.Output",
                                Input = new List<LocationSource> {
                                    new LocationSource {
                                        Address = "@DataSource.Endereco",
                                        Id = "@DataSource.Id",
                                        Latitude = "@DataSource.Latitude",
                                        Longitude = "@DataSource.Longitude",
                                        City = "@DataSource.Cidade",
                                        Name = "@DataSource.Nome",
                                        State = "@DataSource.UF",
                                        ZipCode = "@DataSource.Cep",
                                    }
                                },
                                ServiceType = MapsServiceType.BingMaps,
                                ApiKey = "AssWuoCfzr3Bj3VCRW_MBhW8t8muASrD72l-o40xQabBBDWqAr4-pybu9Ki8FSr6",
                                Selectable = true,
                            }
                        }
                    },
                    new FormStep
                    {
                        NLPSettings = new Config.NLP.Settings
                        {
                             Models = new List<Config.NLP.Model>
                            {
                                new Config.NLP.Model
                                {
                                    AppId = "02f75d97-3b07-451b-a5bd-1707fbaa6983",
                                    Endpoint = "https://nlpinput.cognitiveservices.azure.com",
                                    EndpointPredictionKey = "21821c94a2774e12a4fd43dcd2c3fe6c"
                                }
                            },
                            ServiceType = NlpServiceType.Luis
                        },
                        Id = 6,
                        FormFields = new List<FormField>
                        {
                            new FormField
                            {
                                Id = 1,
                                Name = "RecuperarDados",
                                Question = "Você quer utilizar o nome #Nome# e a idade #Idade#?",
                                Type = FieldTypes.Restore,
                                RestoreFields = new List<string>
                                {
                                    "Nome",
                                    "Idade",
                                },
                            },
                            new FormField
                            {
                                 Id = 2,
                                 Name = "Nome",
                                 Question = "Por favor informe seu nome",
                                 Type = FieldTypes.Text,
                                 Optional = false,
                                 NlpEntityName = "Step"
                            },
                            new FormField
                            {
                                Id = 3,
                                Name = "Idade",
                                Question = "Qual sua idade?",
                                Type = FieldTypes.Number,
                            },
                        },
                        ShowSummary = true,
                        IncludeConfirmationButtonsOnSummary = true,
                        IncludeFieldListOnSummary = true
                    },
                },
                AppPassword = "JhC-Qyj0vQWs/JV:VIw8*SQPYZEa4FD8",
                AppId = "1489db1a-fcf5-4e14-94a5-70e407c9f870",
                PersistenceStrategy = PersistenceStrategies.AzureTables,
                ConnectionString = "DefaultEndpointsProtocol=https;AccountName=carubbiboteditorapi;AccountKey=csp3AaBDt10vBEB4vAPbdaotprAYyW8SPngUwv1ajnW0MxHtZS9rtD1gl7BLWqKA1n3VGKql9I7nZn1aJE4KKw==",
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "carubbiNlp.json"), output);

        }
    }
}
