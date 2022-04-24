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
    public class ReadGPSLocationStepTests : TestBase
    {

        [TestMethod]
        public void ReadGPSLocationStep()
        {
            var botConfig = new BotConfig()
            {
                Id =  Guid.NewGuid(),
                Name = "ReadGPSLocationStep",
                RootStepId = 1,
                Steps = new List<Step>
                {
                    new ConditionStep
                    {
                        Id = 1,
                        ConditionExpression = "@ChannelId == telegram | @ChannelId == facebook",
                        TrueStepId  = 2,
                        FalseStepId = 3
                    },
                   new ReadGPSLocationStep
                   {
                       Id = 2,
                       AskLocationMessage = new MessageInteractions
                       {
                           Typed = new List<string>
                           {
                               "Me manda aonde você tá"
                           },
                       },
                       ErrorStepId = 5,
                       NextStepId = 4,
                   },
                   new MessageStep {
                       Id = 3,
                       Messages = new MessageInteractions
                       {
                           Typed = new List<string>
                           {
                               "Este canal não da suporte a compartilhamento de localização via GPS"
                           }
                       }
                   },
                   new MessageStep {
                       Id = 4,
                       Messages = new MessageInteractions
                       {
                           Typed = new List<string>
                           {
                               "Você está na latitude @ViewBag.Step2.Output.Latitude e na longitude @ViewBag.Step2.Output.Longitude"
                           }
                       }
                   },
                   new MessageStep {
                       Id = 5,
                       Messages = new MessageInteractions
                       {
                           Typed = new List<string>
                           {
                               "Não consegui ler sua localização, vamos começar de novo"
                           }
                       }
                   }
                },
                AppId = "e4f733bb-75c4-4dc5-a2c9-fe5251316d9e",
                AppPassword = "H49JEdu8g-:k:-f1J19j.-?lz3orqq0h",
            };

            string output = JsonConvert.SerializeObject(botConfig);
            File.WriteAllText(Path.Combine(_botsFolder, "ReadGPSLocationStep.json"), output);
        }



    }
}
