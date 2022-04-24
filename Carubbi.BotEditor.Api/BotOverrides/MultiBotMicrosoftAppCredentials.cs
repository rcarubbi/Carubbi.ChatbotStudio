using Carubbi.BotEditor.Config;
using Microsoft.Bot.Connector;
using System;

namespace Carubbi.BotEditor.Api.BotOverrides
{
    public class MultiBotMicrosoftAppCredentials : MicrosoftAppCredentials
    {
        
        public MultiBotMicrosoftAppCredentials(string appId, string appPassword)
            : base(appId, appPassword)
        {
            if (appId == null)
            {
                TrustedHostNames.Clear();
            }
            else
            {
                TrustedHostNames.GetOrAdd(Constants.STATE_BOTFRAMEWORK_URI, x => DateTime.MaxValue);
                TrustedHostNames.GetOrAdd(Constants.TOKEN_BOTFRAMEWORK_URI, x => DateTime.MaxValue);
                TrustedHostNames.GetOrAdd(Constants.API_BOTFRAMEWORK_URI, x => DateTime.MaxValue);
            }
        }
    }
}
