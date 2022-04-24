using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.TextAnalysis
{
    public interface ITextAnalysisService
    {
        Task<double> GetSentimentAsync(string text);
    }
}