using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Models.Response;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Backend.Domain.Integrations
{
    public interface IChannelRegistrationServiceClient
    {
        Task<ChannelRegistrationResponse> RegisterAsync(ChannelRegistrationRequest request);
        Task<ChannelRegistrationResponse> UnregisterAsync(ChannelRegistrationRequest request);
    }
}
