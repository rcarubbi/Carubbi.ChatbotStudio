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
    public class ImageClassificationStepTests : TestBase
    {

        [TestMethod]
        public void GenerateImageClassificationStep()
        {
            var botConfig = new BotConfig()
            {
                Name = "ImageClassificationBot",
                Id = Guid.NewGuid(),
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new ImageClassificationStep
                    {
                        Id = 1,
                        AskImageMessage = new MessageInteractions {
                            Typed = new List<string> {
                                "Envie a foto de um painel de Agile para verificar as luzes"
                            },
                        },
                        RetryMessage = new MessageInteractions {
                            Typed = new List<string> {
                                "Não consegui identificar a foto do painel, pode me enviar de novo?"
                            }
                        },
                        MinScore = 50,
                        MaxResults = 10,
                        ImageClassificationSettings = new Config.ImageClassification.Settings
                        {
                            ServiceType = ImageClassificationServiceType.MicrosoftCustomVision,
                            ProjectId = "1709c7b2-29c8-4c58-9975-8bda40c0c3cc",
                            PredictionEndpoint = "https://westus2.api.cognitive.microsoft.com/",
                            PredictionKey = "acc31cd6fc3c4655a95a17d3d4e6efb6",
                            TrainingEndpoint = "https://westus2.api.cognitive.microsoft.com/",
                            TrainingKey = "2a7797dfc18c45a1b3e59a756858b0ea",

                        },
                        NextStepId = 2,
                        ErrorStepId = 7
                    },
                    new ConditionStep
                    {
                        Id = 2,
                        TrueStepId = 3,
                        FalseStepId = 6,
                        ConditionExpression = "@1.Output.Count > 0"
                    },
                    new MessageStep
                    {
                        Id = 3,
                        NextStepId = 4,
                        Messages = new MessageInteractions {
                            Typed = new List<string> { "Os resultados encontrados foram @foreach(var prediction in ViewBag.Step1.Output) { \r\n <text>Tag: @prediction.Tag, Score: @prediction.Score</text> \r\n }" },
                        },
                    },
                    new TransformStep
                    {
                        Id = 4,
                        DataSourceExpression = "@1.Output",
                        NextStepId = 5,
                        PropertyPath = "@DataSource.Tag",
                        Transformations = new List<Transformation>
                        {
                            new Transformation { InputExpression = "abs_system", OutputExpression = "Sistema ABS" },
                            new Transformation { InputExpression = "break_system", OutputExpression = "Freio de mão puxado" },
                            new Transformation { InputExpression = "door_open", OutputExpression = "Porta aberta" },
                            new Transformation { InputExpression = "engine_cooling", OutputExpression = "Arrefecimento do motor" },
                            new Transformation { InputExpression = "engine_oil_pressure", OutputExpression = "Pressão do óleo baixa" },
                            new Transformation { InputExpression = "fault_indicator", OutputExpression = "Indicador de Falha" },
                            new Transformation { InputExpression = "low_battery", OutputExpression = "Bateria fraca" },
                            new Transformation { InputExpression = "low_fuel", OutputExpression = "Pouco combustível" },
                            new Transformation { InputExpression = "revision", OutputExpression = "Revisão" },
                        }
                    },
                    new MessageStep
                    {
                        Id = 5,
                        Messages =  new MessageInteractions {
                            Typed = new List<string> {
                                "Os resultados encontrados foram @foreach(var prediction in ViewBag.Step4.Output) { \r\n <text>@prediction</text> \r\n }"
                            },
                        },
                    },
                    new MessageStep
                    {
                        Id = 6,
                        Messages = new MessageInteractions {
                            Typed = new List<string> { "Não encontrei nenhuma luz acesa no seu painel" },
                        },
                    },
                    new MessageStep
                    {
                        Id = 7,
                        Messages =  new MessageInteractions {
                            Typed = new List<string> { "Não estou conseguindo entender sua foto agora, se quiser tentar de novo é só me chamar" },
                        }
                    }
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ImageClassificationBot.json"), output);
        }
    }
}
