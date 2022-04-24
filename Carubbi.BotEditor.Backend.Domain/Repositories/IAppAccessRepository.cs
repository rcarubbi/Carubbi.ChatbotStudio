using System.Collections.Generic;
using Carubbi.BotEditor.Backend.Domain.Entities;

namespace Carubbi.BotEditor.Backend.Domain.Repositories
{
    public interface IAppAccessRepository
    {
        void Save(AppAccess appAccess);
        AppAccess GetByClientId(string clientId);
        List<AppAccess> ListAll();
    }
}
