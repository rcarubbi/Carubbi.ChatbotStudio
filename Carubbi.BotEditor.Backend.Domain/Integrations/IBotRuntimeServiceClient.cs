using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Models.Response;

namespace Carubbi.BotEditor.Backend.Domain.Integrations
{
    public interface IBotRuntimeServiceClient
    {
        BotRuntimeResponse Create(BotRuntimeRequest request);
        BotRuntimeResponse Update(BotRuntimeRequest request);

        BotRuntimeResponse Delete(BotRuntimeRequest request);
    }
}
