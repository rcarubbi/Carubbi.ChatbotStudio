using Carubbi.BotEditor.Config.ImageClassification;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training;
using Microsoft.Azure.CognitiveServices.Vision.CustomVision.Training.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PredictionModels = Microsoft.Azure.CognitiveServices.Vision.CustomVision.Prediction.Models;

namespace Carubbi.BotEditor.Services.ImageClassification
{
    public class CustomVisionImageClassificationService : IImageClassificationService
    {
        private readonly Settings _settings;
        private readonly ICustomVisionPredictionClient _predictionClient;
        private readonly ICustomVisionTrainingClient _trainingClient;
        private Iteration _iteration;
        public CustomVisionImageClassificationService(Settings imageClassificationSettings)
        {
            _settings = imageClassificationSettings;

            _predictionClient = new CustomVisionPredictionClient()
            {
                ApiKey = _settings.PredictionKey,
                Endpoint = _settings.PredictionEndpoint
            };


            _trainingClient = new CustomVisionTrainingClient()
            {
                ApiKey = _settings.TrainingKey,
                Endpoint = _settings.TrainingEndpoint
            };
        }

        public async Task<List<ClassificationResult>> ClassifyAsync(string imageUrl)
        {
            var results = await _predictionClient.ClassifyImageUrlAsync(new Guid(_settings.ProjectId), _iteration.PublishName, new PredictionModels.ImageUrl(imageUrl));
            return Parse(results.Predictions);
        }

        private List<ClassificationResult> Parse(IList<PredictionModels.PredictionModel> predictions)
        {
            List<ClassificationResult> results = new List<ClassificationResult>();

            foreach (var item in predictions)
            {
                results.Add(new ClassificationResult
                {
                    Tag = item.TagName,
                    Score = item.Probability * 100
                });
            }

            return results;
        }

        public async Task LoadIteration()
        {
            var projectId = new Guid(_settings.ProjectId);
            var iterations = await _trainingClient.GetIterationsAsync(projectId);
            _iteration = iterations.OrderByDescending(x => x.TrainedAt).FirstOrDefault();
            if (_iteration == null)
            {
                throw new ArgumentException("Id do projeto de custom vision configurado no passo não foi encontrado na conta. Acesse o portal customvision.ai e verifique o id do projeto");
            }
        }
    }
}