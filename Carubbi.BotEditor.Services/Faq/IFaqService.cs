using Carubbi.BotEditor.Config.Faq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.Faq
{
    public interface IFaqService
    {
        Task<Result> QueryAsync(string question);
    }
}