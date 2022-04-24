using Carubbi.BotEditor.Config.NLP;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.Nlp
{
    public interface INLPService
    {
        Task<List<Result>> QueryAsync(string text);

        Task<Result> GetTopScoringResultAsync(string text);
    }
}