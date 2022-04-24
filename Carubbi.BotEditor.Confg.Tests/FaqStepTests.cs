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
    public class FaqStepTests : TestBase
    {
        [TestMethod]
        public void GenerateFaqBot()
        {
            var botConfig = new BotConfig()
            {
                Name = "FaqBot",
                Id = Guid.NewGuid(),
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new FaqStep
                    {
                        Id = 1,
                        FaqSettings = new Config.Faq.Settings
                        {
                            Endpoint = "https://carubbiqnasample.azurewebsites.net",
                            ServiceType = FaqServiceType.QnAMaker,
                            EndpointKey = "9b6b02ab-e350-4d06-9bc1-c5faeff8fcfd",
                            KnowledgeBaseId = "cd2ad4a7-50c1-4753-8ec7-ced40bfd7c98",
                            MaxAnswers = 2,
                        },
                        AskQuestionMessage = new MessageInteractions {
                            Typed = new List<string> {
                                "O que você deseja saber sobre o pagseguro?"
                            }
                        },
                        MinimumScore = 10,
                        NextStepId = 2
                    },
                    new ConditionStep
                    {
                        Id = 2,
                        TrueStepId = 3,
                        FalseStepId = 4,
                        ConditionExpression = "@1.Output.Count > 0",
                    },
                    new MessageStep
                    {
                        Id = 3,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                @"Aqui estão as perguntas e respostas relevantes que eu encontrei relacionadas a sua dúvida: @foreach (var answer in ViewBag.Step1.Output) {
                                    <text>Perguntas: \r\n</text>
                                    foreach( var question in answer.Questions) 
                                    {
                                        <text>* @question \n\r\n\r</text>
                                    }
                                    <text>Resposta: @answer.Text</text>
                                }"
                            }
                        }
                    },
                    new MessageStep
                    {
                        Id = 4,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                @"Desculpe, eu ainda não sei a resposta para esta pergunta. Tente reformular sua pergunta. Talvez eu consiga te ajudar."
                            }
                        }
                    }
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "FaqBot.json"), output);
        }
    }
}
