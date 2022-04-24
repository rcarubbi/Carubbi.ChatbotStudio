using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Config.TextAnalysis;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace Carubbi.BotEditor.Confg.Tests
{
    [TestClass]
    public class InputStepTests : TestBase
    {

        [TestMethod]
        public void SimpleInput()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "SimpleInput",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new InputStep
                    {
                        Id = 1,
                        Question = new MessageInteractions {
                            Typed = new List<string> {
                                "Qual o seu nome?"
                            }
                        },
                        NextStepId = 2
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Olá @ViewBag.Step1.Output.Answer seja bem-vindo",
                                "Oi @ViewBag.Step1.Output.Answer como posso te ajudar?"
                            },
                        },
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "SimpleInput.json"), output);
        }

        [TestMethod]
        public void SentimentAnalysisInput()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "SentimentAnalysisInput",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new InputStep
                    {
                        Id = 1,
                        Question = new MessageInteractions {
                            Typed = new List<string> { "O que achou do meu atendimento?" }
                        },
                        NextStepId = 2,
                        TextAnalysisSettings = new TextAnalysisSettings
                        {
                            ServiceType = TextAnalysisServiceType.MicrosoftTextAnalysis,
                            Language = "pt",
                            SubscriptionKey = "57a25c1dd14343af99f88c5416368b1e",
                            Endpoint = "https://bottextanalytics.cognitiveservices.azure.com"
                        }
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                "O Score da sua resposta é @ViewBag.Step1.Output.SentimentScore"
                            }
                        },
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "SentimentAnalysisInput.json"), output);
        }

        [TestMethod]
        public void NlpInput()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "NlpInput",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new InputStep
                    {
                        Id = 1,
                        Question = new MessageInteractions {
                            Typed = new List<string> { "O que você deseja?" }
                        },
                        NextStepId = 2,
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
                    },
                new MessageStep
                {
                    Id = 2,
                    Messages = new MessageInteractions
                    {
                        Typed = new List<string>
                            {
                                @"A intenção encontrada foi @ViewBag.Step1.Output.NLPResult.Intent.Name 
    com o score @ViewBag.Step1.Output.NLPResult.Intent.Score 
    Entidades Encontradas: 
    @foreach(var entity in ViewBag.Step1.Output.NLPResult.Entities) { 
        <text>Tipo: @(entity.Type), Valor: @entity.Name</text>
    }"
                            },
                    },
                },
            },
                PersistenceStrategy = PersistenceStrategies.AzureTables,
                ConnectionString = "DefaultEndpointsProtocol=https;AccountName=carubbiboteditorapi;AccountKey=csp3AaBDt10vBEB4vAPbdaotprAYyW8SPngUwv1ajnW0MxHtZS9rtD1gl7BLWqKA1n3VGKql9I7nZn1aJE4KKw=="
            };

        string output = JsonConvert.SerializeObject(botConfig);
        File.WriteAllText(Path.Combine(_botsFolder, "NlpInput.json"), output);
        }
}
}
