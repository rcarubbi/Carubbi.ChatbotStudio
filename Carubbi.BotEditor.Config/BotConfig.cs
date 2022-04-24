using Carubbi.BotEditor.Config.NLP;
using Carubbi.BotEditor.Config.Steps;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace Carubbi.BotEditor.Config
{
    [Serializable]
    public class BotConfig : IStepsContainer, ICloneable
    {
        public Guid Id { get; set; }

        public string Name { get; set; }

        public int RootStepId { get; set; }

        public List<Step> Steps { get; set; }

        public List<CustomCommandConfig> CustomCommands { get; set; }

        public SpeechSettings SpeechSettings { get; set; }

        public string AppId { get; set; }
        public string AppPassword { get; set; }
        public string ConnectionString { get; set; }
        public PersistenceStrategies PersistenceStrategy { get; set; }

        public string StartMessage { get; set; }

       

        public DateTime UpdatedAt { get; set; }
        public string UpdateVersionMessage { get; set; }

        public object Clone()
        {
            CustomCommandConfig[] customCommandsCopy = null;
            if (CustomCommands != null)
            {
                customCommandsCopy = new CustomCommandConfig[CustomCommands.Count];
                CustomCommands.CopyTo(customCommandsCopy);
            }

            var stepsCopy = new Step[Steps.Count];

            Steps.CopyTo(stepsCopy);

            return new BotConfig
            {
                Id = Id,
                Name = Name,
                PersistenceStrategy = PersistenceStrategy,
                RootStepId = RootStepId,
                SpeechSettings = SpeechSettings != null ? (SpeechSettings)SpeechSettings.Clone() : null,
                AppId = AppId,
                AppPassword = AppPassword,
                ConnectionString = ConnectionString,
                CustomCommands = customCommandsCopy == null ? null : customCommandsCopy.ToList(),
                Steps = stepsCopy.ToList(),
                
                StartMessage = StartMessage,
                UpdatedAt = UpdatedAt,
            };
        }

        public string GetDynamicStateBasePath()
        {
            string workingDirectory = AppDomain.CurrentDomain.BaseDirectory;
            string projectDirectory = Directory.GetParent(workingDirectory).FullName;
            return Path.Combine(projectDirectory, "FormStepAssemblies", Id.ToString());
        }

        public BotInstanceSettings ToInstanceSettings()
        {
            return new BotInstanceSettings
            {
                AppId = AppId,
                ConnectionString = ConnectionString,
                AppPassword = AppPassword,
                BotId = Id.ToString(),
                Name = Name,
                PersistenceStrategy = PersistenceStrategy
            };
        }

        public IEnumerable<NLP.Entity> GetNLPEntities()
        {
            var nlpSteps = Steps.Where(x => x is INLPStep).Cast<INLPStep>().ToList();
            var entities = nlpSteps.SelectMany(x => x.Output.NLPResult == null ? new List<Entity>() : x.Output.NLPResult.Entities);
            return entities.ToList();
        }

    }
}