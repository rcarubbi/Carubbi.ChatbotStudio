using Carubbi.BotEditor.Config.Steps;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace Carubbi.BotEditor.Config.Extensions
{
    public static class StepsContainerExtensions
    {
        public static List<FormStep> GetFormSteps(this IStepsContainer container, bool updateHash)
        {
            List<FormStep> steps = new List<FormStep>();
            foreach (var stepsContainer in container.Steps.Where(s => s is IStepsContainer).Cast<IStepsContainer>().ToList())
            {
                steps.AddRange(GetFormSteps(stepsContainer, updateHash));
            }

            var formSteps = container.Steps.Where(s => s is FormStep).Cast<FormStep>().ToList();

            if (updateHash) formSteps.ForEach(fs => fs.Hash = JsonConvert.SerializeObject(fs).GetHashCode());

            steps.AddRange(formSteps);

            return steps;
        }
    }
}
