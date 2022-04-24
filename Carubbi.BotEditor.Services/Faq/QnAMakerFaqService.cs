using Carubbi.BotEditor.Config.Faq;
using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker;
using Microsoft.Azure.CognitiveServices.Knowledge.QnAMaker.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.Faq
{
    [Serializable]
    public class QnAMakerFaqService : IFaqService
    {
        private readonly Settings _settings;

        public QnAMakerFaqService(Settings settings)
        {
            _settings = settings;
        }

        public async Task<Result> QueryAsync(string question)
        {
            using (var client = new QnAMakerRuntimeClient(
                new EndpointKeyServiceClientCredentials(_settings.EndpointKey),
                new DelegatingHandler[] { })
            {
                RuntimeEndpoint = _settings.Endpoint
            })
            {
                var runtime = new Runtime(client);
                try
                {
                    var response = await runtime.GenerateAnswerAsync(_settings.KnowledgeBaseId, new QueryDTO
                    {
                        Question = question,
                        Top = _settings.MaxAnswers
                    });


                    return new Result
                    {
                        Answers = ParseAsnwers(response.Answers)
                    };
                }
                catch (Exception)
                {
                }
                return null;
            }
        }

        private List<Answer> ParseAsnwers(IList<QnASearchResult> answersSource)
        {
            List<Answer> answers = new List<Answer>();
            foreach (var item in answersSource)
            {
                answers.Add(new Answer
                {
                    Text = item.Answer,
                    Score = item.Score.Value * 100,
                    Questions = item.Questions.ToList(),
                });
            }

            return answers;
        }
    }
}