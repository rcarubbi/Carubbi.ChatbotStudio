using Carubbi.BotEditor.Config;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;
using System.Web;

namespace Carubbi.BotEditor.Services.SpeechRecognition
{
    public class BingSpeechRecognitionService : ISpeechRecognitionService
    {
        private readonly SpeechRecognitionSettings _recognitionSettings;
        private readonly HttpContext _context;

        public BingSpeechRecognitionService(SpeechRecognitionSettings recognitionSettings, HttpContext context)
        {
            _context = context;
            _recognitionSettings = recognitionSettings;
        }

        public async Task<string> RecognizeAsync(Uri audioUrl)
        {
            try
            {
                HttpWebRequest request = null;
                request = (HttpWebRequest)WebRequest.Create($"https://{_recognitionSettings.ServiceRegion}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language={_recognitionSettings.Language}");
                request.SendChunked = true;
                request.Accept = @"application/json;text/xml";
                request.Method = "POST";
                request.ProtocolVersion = HttpVersion.Version11;
                request.Host = $"{_recognitionSettings.ServiceRegion}.stt.speech.microsoft.com";
                request.ContentType = @"audio/ogg; codecs=opus";
                request.Headers["Ocp-Apim-Subscription-Key"] = _recognitionSettings.SubscriptionKey;
                request.AllowWriteStreamBuffering = false;

                using (var webClient = new WebClient())
                {
                    var ogaData = await webClient.DownloadDataTaskAsync(audioUrl);
                    using (var ms = new MemoryStream(ogaData))
                    {
                        /*
                        * Open a request stream and write 1024 byte chunks in the stream one at a time.
                        */
                        byte[] buffer = null;
                        int bytesRead = 0;

                        using (Stream requestStream = request.GetRequestStream())
                        {
                            /*
                            * Read 1024 raw bytes from the input audio file.
                            */
                            buffer = new byte[checked((uint)Math.Min(1024, (int)ms.Length))];
                            while ((bytesRead = ms.Read(buffer, 0, buffer.Length)) != 0)
                            {
                                requestStream.Write(buffer, 0, bytesRead);
                            }

                            // Flush
                            requestStream.Flush();
                        }
                    }
                }

                var response = request.GetResponse();
                var stream = response.GetResponseStream();
                var responseText = string.Empty;
                using (var sr = new StreamReader(stream))
                {
                    var speechServiceResponse = JsonConvert.DeserializeObject<dynamic>(sr.ReadToEnd());
                    responseText = speechServiceResponse.DisplayText;
                }

                return Sanitize(responseText);
            }
            catch (WebException ex)
            {
                
                using (var sr = new StreamReader(ex.Response.GetResponseStream()))
                {
                    var txt = sr.ReadToEnd();
                }
                var a = ex;
                return null;
            }
        }

        private string Sanitize(string responseText)
        {
            if (responseText.EndsWith("."))
            {
                return responseText.Substring(0, responseText.Length - 1);
            }

            return responseText;
        }
    }
    
}

