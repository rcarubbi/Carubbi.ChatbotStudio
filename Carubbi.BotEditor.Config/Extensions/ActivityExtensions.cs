using Microsoft.Bot.Connector;
using System.Collections.Generic;

namespace Carubbi.BotEditor.Config.Extensions
{
    public static class ActivityExtensions
    {
        private const string AUDIO_CONTENT_TYPE = "audio/ogg";
        public static bool HasAudioAttachment(this IMessageActivity instance)
        {
            return instance.Attachments?.Count > 0 && instance.Attachments[0].ContentType == AUDIO_CONTENT_TYPE;
        }

        public static void MakeAudioCard(this IMessageActivity instance, string url)
        {
            var card = new AudioCard
            {
                Media = new List<MediaUrl>
                {
                    new MediaUrl { Url = url }
                }
            };
            instance.Attachments.Add(card.ToAttachment());
        }
    }
}
