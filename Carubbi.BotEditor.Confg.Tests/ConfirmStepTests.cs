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
    public class ConfirmStepTests : TestBase
    {

        [TestMethod]
        public void SimpleConfirm()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "SimpleConfirm",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new ConfirmStep
                    {
                        Id = 1,
                        Question = new MessageInteractions
                        {
                            Typed = new List<string> {
                                "É sua primeira vez por aqui?"
                            }
                        },
                        TrueStepId = 2,
                        FalseStepId = 3
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Então seja bem-vindo"
                            }
                        },
                    },
                    new MessageStep
                    {
                        Id = 3,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Que bom te ver de novo!"
                            }
                        }
                    }
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "SimpleConfirm.json"), output);
        }

        [TestMethod]
        public void RetrieveConfirmAnswer()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "RetrieveConfirmAnswer",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new ConfirmStep
                    {
                        Id = 1,
                        Question = new MessageInteractions {
                            Typed = new List<string>  {
                                "É sua primeira vez por aqui?"
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
                                "Sua resposta foi @(ViewBag.Step1.Output == null ? \"Nada\" : ViewBag.Step1.Output.Answer)"
                            },
                        },
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "RetrieveConfirmAnswer.json"), output);
        }

        [TestMethod]
        public void ConfirmAdvancedConfiguration()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "ConfirmAdvancedConfiguration",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new ConfirmStep
                    {
                        Id = 1,
                        Question = new MessageInteractions {
                            Typed = new List<string> {
                                "É sua primeira vez por aqui?"
                            }
                        },
                        Attempts = 1,
                        NoAcceptedAnswers = new string[] { "Nah", "É nada", "Não é" },
                        YesAcceptedAnswers = new string[] { "É", "claro" },
                        NoText = "Não é",
                        YesText = "É",
                        RetryMessage = new MessageInteractions {
                            Typed = new List<string> { "Não entendi! Fala de novo!" }
                        },
                        NextStepId = 2,
                        TooManyAttemptsMessage = new MessageInteractions {
                            Typed = new List<string> {"Ah... Desisto!"
                            }
                        }
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Sua resposta foi @(ViewBag.Step1.Output == null ? \"Nada\" : ViewBag.Step1.Output.Answer)"
                            },
                        },
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ConfirmAdvancedConfiguration.json"), output);
        }

        [TestMethod]
        public void ChainedConfirms()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "ChainedConfirms",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new ConfirmStep
                    {
                        Id = 1,
                        Question = new MessageInteractions {
                            Typed = new List<string> {"É sua primeira vez por aqui?"
                            }
                        },
                        TrueStepId = 2,
                        FalseStepId = 3
                    },
                    new ConfirmStep
                    {
                        Id = 2,
                        Question = new MessageInteractions {
                            Typed = new List<string> {"Já utilizou outros bots antes?"
                            }
                        },
                        NextStepId = 4
                    },
                    new ConfirmStep
                    {
                        Id = 3,
                        Question = new MessageInteractions {
                            Typed = new List<string> {"Gosta deste Bot?"
                            }
                        },
                        NextStepId = 4
                    },
                    new MessageStep
                    {
                        Id = 4,
                        Messages =  new MessageInteractions
                        {
                            Typed = new List<string> {
                                "Dialogo 1: @(ViewBag.Step1.Output == null ? \"Nada\" : ViewBag.Step1.Output.Answer) \r\n Dialogo 2: @(ViewBag.Step2.Output == null ? \"Nada\" : ViewBag.Step2.Output.Answer) \r\n Dialogo 3: @(ViewBag.Step3.Output == null ? \"Nada\" : ViewBag.Step3.Output.Answer)"
                            }
                        }
                    }
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ChainedConfirms.json"), output);
        }
    }
}
