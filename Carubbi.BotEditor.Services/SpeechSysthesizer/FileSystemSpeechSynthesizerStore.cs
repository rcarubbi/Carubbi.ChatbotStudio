using System;
using System.Configuration;
using System.IO;
using System.Web;

namespace Carubbi.BotEditor.Services.SpeechSysthesizer
{
    public class FileSystemSpeechSynthesizerStore : ISpeechSynthesizerStore
    {
        private const string SYNTH_CACHE_PATH = "SynthCache";
        private readonly HttpContext _httpContext;
        private readonly string _tunnelingServer;
        public FileSystemSpeechSynthesizerStore(HttpContext httpContext)
        {
            _httpContext = httpContext;
            _tunnelingServer = ConfigurationManager.AppSettings["TunnelingServer"];
        }

        private static string GetSysthesisPath()
        {
            return Path.Combine(AppDomain.CurrentDomain.BaseDirectory, SYNTH_CACHE_PATH);
        }

        public string SaveSysthesis(string key, byte[] audioData)
        {
            var httpContext = _httpContext ?? HttpContext.Current;
            var path = GetSysthesisPath();
            EnsurePath(path);
            var fileName = $"{key}.mp3";
            File.WriteAllBytes(Path.Combine(path, fileName), audioData);
            var server = _tunnelingServer ?? $"{httpContext.Request.Url.Scheme}://{httpContext.Request.Url.Authority}";
            string url = $"{server}/{SYNTH_CACHE_PATH}/{fileName}";
            return url;
        }

        private static void EnsurePath(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
        }
    }
}