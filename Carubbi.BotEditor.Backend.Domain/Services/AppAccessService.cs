using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace Carubbi.BotEditor.Backend.Domain.Services
{
    public class AppAccessService
    {
        private readonly IAppAccessRepository _appAccessRepository;

        public AppAccessService(IAppAccessRepository appAccessRepository)
        {
            _appAccessRepository = appAccessRepository;
        }

        public AppAccess GrantApplication(string name)
        {
            var newAppAccess = new AppAccess {
                ClientId = Guid.NewGuid().ToString("N"),
                SecretKey = GenerateRandomNumber(),
                AccessKey = GenerateRandomNumber(),
                ApplicationName = name
            };

            newAppAccess.Id = _appAccessRepository.Save(newAppAccess);
        
            return newAppAccess;
        }

        private string GenerateRandomNumber()
        {
            var key = new byte[32];
            using (var numberGenerator = RandomNumberGenerator.Create())
            {
                numberGenerator.GetBytes(key);
                return TextEncodings.Base64Url.Encode(key);
            }
        }

        public AppAccess Find(string clientId)
        {
            var appAccess = _appAccessRepository.GetByClientId(clientId);
            return appAccess;
        }

        public List<AppAccess> ListAll()
        {
            return _appAccessRepository.ListAll();
        }
    }
}