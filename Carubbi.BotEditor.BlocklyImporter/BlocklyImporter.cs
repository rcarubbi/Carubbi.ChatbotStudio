using Carubbi.BotEditor.Config;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.BlocklyImporter
{
    public class BlocklyImporter
    {
        public string ConvertFromBotConfigJson(string json)
        {
            var botConfig = JsonConvert.DeserializeObject<BotConfig>(json);
            

            var botconfigBlock = new Block();
            botconfigBlock.Id = botConfig.Id.ToString();
            botconfigBlock.Type = "botconfig";
            botconfigBlock.Field.Add(new Field() { Name = nameof(botConfig.Name), Text = botConfig.Name });
            botconfigBlock.Next.Block = new Block();
            
        }
    }
}
