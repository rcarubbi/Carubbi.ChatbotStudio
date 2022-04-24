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
    public class ListStepTests : TestBase
    {

        [TestMethod]
        public void ButtonList()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "ButtonList",
                RootStepId = 1,

                Steps = new List<Step>
                {
                    new ListStep
                    {
                        Id = 1,
                        RetryMessage = new MessageInteractions {
                            Typed = new List<string> { "Tenta de novo" }
                        },
                        ListType = ListTypes.ButtonList,
                        Input = new List<ListItem>
                        {
                            new ListItem
                            {
                                Order = 1,
                                Title = "Passo 2",
                                TargetStepId = 2
                            },
                            new ListItem
                            {
                                Order = 2,
                                Title = "Passo 3",
                                TargetStepId = 3
                            },
                            new ListItem
                            {
                                Order = 3,
                                Title = "Passo 4",
                                TargetStepId = 4
                            }
                        },
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages = new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Este é o passo @ViewBag.Step2.Id"
                            }
                        },
                    },
                    new MessageStep
                    {
                        Id = 3,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Este é o passo @ViewBag.Step3.Id"
                            },
                        },
                    },
                    new MessageStep
                    {
                        Id = 4,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Este é o passo @ViewBag.Step4.Id"
                            },
                        },
                    },
                },
                AppId = "f03963af-e755-4c94-a6d2-6e5aa47cc463",
                AppPassword = "fskBbZaDT2]*/?3kOsMPph5qckpa8Uuw",
                PersistenceStrategy = PersistenceStrategies.AzureTables,
                ConnectionString = "DefaultEndpointsProtocol=https;AccountName=carubbiboteditorapi;AccountKey=csp3AaBDt10vBEB4vAPbdaotprAYyW8SPngUwv1ajnW0MxHtZS9rtD1gl7BLWqKA1n3VGKql9I7nZn1aJE4KKw=="
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ButtonList.json"), output);
        }

        [TestMethod]
        public void ImageButtonList()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "ImageButtonList",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new ListStep
                    {
                        Id = 1,
                        ListType = ListTypes.ImageButtonList,
                        Input = new List<ListItem>
                        {
                            new ListItem
                            {
                                Order = 1,
                                Action = ItemActions.OpenURL,
                                ButtonValue = "http://www.google.com",
                                ButtonTitle = "Abrir Google",
                                Title = "Pesquisar",
                                Subtitle = "Na web",
                                ImageUrl = "https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png",
                            },
                            new ListItem
                            {
                                Order = 2,
                                Action = ItemActions.DownloadFile,
                                ButtonValue = "http://files.customersaas.com/files/Samsung_A510F_Galaxy_A5_(2016)_Manual_do_usu%C3%A1rio.pdf",
                                ButtonTitle = "Download",
                                Title = "Baixar Manual",
                                Subtitle = "Samsung Galaxy A5",
                                ImageUrl = "https://images.whatismyphone.com/DI/Front_72656.png",

                            },
                            new ListItem
                            {
                                Order = 3,
                                Action = ItemActions.NavigateStep,
                                ButtonTitle = "Navegar",
                                ButtonValue = "Navegar",
                                TargetStepId = 3,
                                Title = "Ir para o último passo",
                                Subtitle = "Pular o passo 2",
                                ImageUrl = "https://cdn4.iconfinder.com/data/icons/pretty-office-part-5-shadow-style/256/Navigate-right.png",
                            }
                        },
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Este é o passo @ViewBag.Step2.Id"
                            },
                        },
                    },
                    new MessageStep
                    {
                        Id = 3,
                        Messages = new MessageInteractions {
                            Typed =  new List<string>
                            {
                                "Este é o passo @ViewBag.Step3.Id"
                            },
                        },
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ImageButtonList.json"), output);
        }

        [TestMethod]
        public void ImageListWithNlp()
        {
            var botConfig = new BotConfig()
            {
                Id = Guid.NewGuid(),
                Name = "ImageListWithNlp",
                RootStepId = 1,
                Steps = new List<Step>
                {
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
                        Id = 1,
                        ListType = ListTypes.ImageList,
                        Input = new List<ListItem>
                        {
                            new ListItem
                            {
                                Order = 1,
                                Action = ItemActions.NavigateStep,
                                ButtonValue = "Faq",
                                Title = "FAQ",
                                Subtitle = "QnA Maker",
                                ImageUrl = "",
                                TargetStepId = 2
                            },
                            new ListItem
                            {
                                Order = 2,
                                Action = ItemActions.NavigateStep,
                                ButtonValue = "Input",
                                Title = "Input",
                                Subtitle = "Input Step",
                                ImageUrl = "",
                                TargetStepId = 3
                            },
                        },
                    },
                    new MessageStep
                    {
                        Id = 2,
                        Messages =  new MessageInteractions {
                            Typed = new List<string>
                            {
                                "Este é o passo do FAQ"
                            },
                        },
                    },
                    new MessageStep
                    {
                        Id = 3,
                        Messages = new MessageInteractions {
                            Typed =  new List<string>
                            {
                                "Este é o passo do input"
                            },
                        },
                    },
                }
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ImageListWithNlp.json"), output);
        }
    }
}
