using Carubbi.BotEditor.Config.ImageClassification;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.ImageClassification
{
    public interface IImageClassificationService
    {
        Task LoadIteration();
        Task<List<ClassificationResult>> ClassifyAsync(string imageUrl);
    }
}