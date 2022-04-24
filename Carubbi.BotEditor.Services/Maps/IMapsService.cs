using Carubbi.BotEditor.Config.Maps;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.Maps
{
    public interface IMapsService
    {
        Task<LocationSet> GetLocationsByQueryAsync(string address);
        Task<LocationSet> GetLocationsByPointAsync(double latitude, double longitude);

        string GetLocationMapImageUrl(Location location, int? index = null, int zoomFactor = 17, int dpi = 2);
    }
}
