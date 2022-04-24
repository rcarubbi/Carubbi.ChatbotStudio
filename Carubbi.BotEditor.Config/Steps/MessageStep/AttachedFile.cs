using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace Carubbi.BotEditor.Config.Steps
{
    [Serializable]
    public class AttachedFile
    {
        public string Filename { get; set; }

        public string Url { get; set; }


        public bool IsImage()
        {
            return GetImageFileExtensions().Contains(Path.GetExtension(Filename).ToLower());
        }

        private static List<string> GetImageFileExtensions()
        {
            return ImageCodecInfo.GetImageEncoders()
                                 .Select(c => c.FilenameExtension)
                                 .SelectMany(e => e.Split(';'))
                                 .Select(e => e.Replace("*", "").ToLower())
                                 .ToList();
        }
    }
}
