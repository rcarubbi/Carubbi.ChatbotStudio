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
    public class MessageStepTests : TestBase
    {

        [TestMethod]
        public void SingleMessage()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "SingleMessage",
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
                            }
                        }
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "SingleMessage.json"), output);
        }

        [TestMethod]
        public void RandomMessage()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "RandomMessage",
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
                                "E ai!",
                                "Tudo bem?",
                                "Beleza?",
                                "Como está?",
                                "Fala cara!",
                                "Opa!",
                                "Tudo Certo?",
                            }
                        }
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "RandomMessage.json"), output);
        }

        [TestMethod]
        public void MultipleMessages()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "MultipleMessages",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new MessageStep
                    {
                        Id = 1,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Olá"
                            },
                        },
                        NextStepId = 2
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Tudo bem?",
                            }
                        }
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "MultipleMessages.json"), output);
        }

    }
}
