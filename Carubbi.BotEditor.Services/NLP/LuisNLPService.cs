using Carubbi.BotEditor.Config.NLP;
using Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime;
using Microsoft.Azure.CognitiveServices.Language.LUIS.Runtime.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Services.Nlp
{
    [Serializable]
    public class LuisNLPService : INLPService
    {
        private readonly Settings _nlpSettings;

        public LuisNLPService(Settings nlpSettings)
        {
            _nlpSettings = nlpSettings ?? throw new System.ArgumentNullException(nameof(nlpSettings));
        }

        public async Task<List<Result>> QueryAsync(string text)
        {
            var results = new List<Result>();

            foreach (var nlpModel in _nlpSettings.Models)
            {
                using (var client = new LUISRuntimeClient(
                    new ApiKeyServiceClientCredentials(nlpModel.EndpointPredictionKey),
                    new DelegatingHandler[] { })
                {
                    Endpoint = nlpModel.Endpoint
                })
                {
                    var prediction = new Prediction(client);
                    var response = await prediction.ResolveAsync(nlpModel.AppId, text);
                    results.Add(new Result
                    {
                        Intent = new Intent
                        {
                            Name = response.TopScoringIntent.Intent,
                            Score = response.TopScoringIntent.Score.Value * 100
                        },
                        Entities = ParseEntities(response.Entities, response.CompositeEntities)
                    });
                }
            }

            return results;
        }

        private List<Entity> ParseEntities(IList<EntityModel> entities, IList<CompositeEntityModel> compositeEntities)
        {
            var nlpEntities = new List<Entity>();

            foreach (var item in entities)
            {
                nlpEntities.Add(new Entity
                {
                    Name = item.Entity,
                    Type = item.Type
                });
            }

            if (compositeEntities != null)
            {
                foreach (var item in compositeEntities)
                {
                    foreach (var child in item.Children)
                    {
                        nlpEntities.Add(new Entity
                        {
                            Name = $"{item.Value}.{child.Value}",
                            Type = $"{item.ParentType}.{child.Type}"
                        });
                    }
                }
            }

            return nlpEntities;
        }

        public async Task<Result> GetTopScoringResultAsync(string text)
        {
            var results = await QueryAsync(text);
            return results.OrderByDescending(y => y.Intent.Score).First();
        }
    }
}