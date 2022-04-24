using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Steps
{
    public class ValidationResponse
    {
        public bool Valid { get; set; }

        public List<string> ErrorMessages { get; set; }
        public List<string> SpokenErrorMessages { get; set; }
         
    }
}
