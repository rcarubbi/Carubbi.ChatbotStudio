using Carubbi.BotEditor.Config.TextAnalysis;
using Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime;
using Microsoft.Azure.CognitiveServices.Language.TextAnalytics;
using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.TextAnalysis
{
    [Serializable]
    public class MsTextAnalysisService : ITextAnalysisService
    {
        private readonly TextAnalysisSettings _settings;

        public MsTextAnalysisService(TextAnalysisSettings settings)
        {
            _settings = settings;
        }

        public async Task<double> GetSentimentAsync(string text)
        {
            using (var textAnalyticsClient = new TextAnalyticsClient(
                new ApiKeyServiceClientCredentials(_settings.SubscriptionKey),
                new DelegatingHandler[] { }) {
                Endpoint = _settings.Endpoint
            }) 
            {
                var response = await textAnalyticsClient.SentimentAsync(text, _settings.Language, false, CancellationToken.None);  
                return response.Score.Value * 100;
            }
        }
    }
}