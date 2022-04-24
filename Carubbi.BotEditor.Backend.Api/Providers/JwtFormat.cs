using Carubbi.BotEditor.Backend.Domain.Services;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataHandler.Encoder;
using System;
using System.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace Carubbi.BotEditor.Backend.Api.Providers
{
    public class JwtFormat : ISecureDataFormat<AuthenticationTicket>
    {
        private readonly string _issuer = string.Empty;
        private readonly AppAccessService _appAccessService;

        public JwtFormat(string issuer, AppAccessService appAccessService)
        {
            _issuer = issuer;
            _appAccessService = appAccessService;
        }

        public string Protect(AuthenticationTicket data)
        {
            string audience = data.Properties.Dictionary["audience"];
            if (string.IsNullOrWhiteSpace(audience)) throw new InvalidOperationException("ClientId e AccessKey não foi encontrado");
            var keys = audience.Split(':');
            var client_id = keys.First();
            var applicationAccess = _appAccessService.Find(client_id);
            var issued = data.Properties.IssuedUtc;
            var expires = data.Properties.ExpiresUtc;
            var symmetricKey = TextEncodings.Base64Url.Decode(applicationAccess.SecretKey);
            var tokenDescriptor = new Microsoft.IdentityModel.Tokens.SecurityTokenDescriptor
            {
                Subject = data.Identity,
                Audience = client_id,
                Issuer = _issuer,
                IssuedAt = issued.Value.UtcDateTime,
                Expires =  expires.Value.UtcDateTime,
                SigningCredentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(
                    new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(symmetricKey),
                    SecurityAlgorithms.HmacSha256Signature,
                    SecurityAlgorithms.Sha256Digest)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
            return tokenString; 
        }
        public AuthenticationTicket Unprotect(string protectedText)
        {
            throw new NotImplementedException();
        }

    }
}