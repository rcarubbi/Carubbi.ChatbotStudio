using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using System;
using System.IO;
using System.Reflection;

namespace Carubbi.BotEditor.Api.Forms
{
    public class FormStepLoader
    {
        private readonly BotConfig _botConfig;

        public FormStepLoader(BotConfig botConfig)
        {
            _botConfig = botConfig;
        }

        public Type LoadForm(FormStep step)
        {
            Assembly assembly = null;
            var className = $"Step{step.Id}";
            var assemblyName = Path.Combine(_botConfig.GetDynamicStateBasePath(), string.Format("{0}V{1}.dll", className, step.Version));
            try
            {
                assembly = Assembly.LoadFrom(assemblyName);
            }
            catch (Exception)
            {
                try
                {
                    assembly = Assembly.LoadFile(assemblyName);
                }
                catch (Exception)
                {
                    throw;
                }
            }

            Type type = assembly.GetType($"{_botConfig.Name.Replace(" ", "")}.{className}");
            return type;
        }

       
    }
}