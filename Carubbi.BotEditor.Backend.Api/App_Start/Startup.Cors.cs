using Microsoft.Owin.Cors;
using Owin;
using System.Configuration;
using System.Threading.Tasks;
using System.Web.Cors;

namespace Carubbi.BotEditor.Backend.Api
{
    public partial class Startup
    {
        public void ConfigureCors(IAppBuilder app)
        {
            var corsPolicy = new CorsPolicy
            {
                AllowAnyHeader = true,
                AllowAnyMethod = true
            };

            // Try and load allowed origins from web.config
            // If none are specified we'll allow all origins

            var origins = ConfigurationManager.AppSettings["CorsOrigins"];

            if (origins != null && origins != "*")
                foreach (var origin in origins.Split(';'))
                    corsPolicy.Origins.Add(origin);
            else
                corsPolicy.AllowAnyOrigin = true;

            var corsOptions = new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = context => Task.FromResult(corsPolicy)
                    
                }
            };

            app.UseCors(corsOptions);
        }
    }
}