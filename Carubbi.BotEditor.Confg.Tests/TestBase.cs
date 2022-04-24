using Carubbi.BotEditor.Config.WebApiIntegration;
using System.IO;

namespace Carubbi.BotEditor.Confg.Tests
{

    public abstract class TestBase
    {
        protected readonly string _botsFolder;

        public TestBase()
        {
            _botsFolder = Path.GetFullPath("~/../../../../../Carubbi.BotEditor.Api/bots");
            WebApiIntegration.ConfigureSerializer();
        }
    }
}
