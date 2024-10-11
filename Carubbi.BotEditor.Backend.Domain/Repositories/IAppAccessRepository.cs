using System;
using System.Collections.Generic;
using Carubbi.BotEditor.Backend.Domain.Entities;

namespace Carubbi.BotEditor.Backend.Domain.Repositories
{
    public interface IAppAccessRepository
    {
        Guid Save(AppAccess appAccess);
        AppAccess GetByClientId(string clientId);
        List<AppAccess> ListAll();
    }
}
