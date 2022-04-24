using Autofac;
using Carubbi.BotEditor.Services.Faq;
using Carubbi.BotEditor.Services.ImageClassification;
using Carubbi.BotEditor.Services.Maps;
using Carubbi.BotEditor.Services.Nlp;
using Carubbi.BotEditor.Services.SpeechRecognition;
using Carubbi.BotEditor.Services.TextAnalysis;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.TextAnalysis;

namespace Carubbi.BotEditor.Services.Autofac
{
    public class ServicesModule : Module
    {

        protected override void Load(ContainerBuilder builder)
        {

            builder.RegisterType<BingGeoSpatialService>()
                .Keyed<IMapsService>(MapsServiceType.BingMaps);

            builder.RegisterType<QnAMakerFaqService>()
                .Keyed<IFaqService>(FaqServiceType.QnAMaker);


            builder.RegisterType<CustomVisionImageClassificationService>()
                .Keyed<IImageClassificationService>(ImageClassificationServiceType.MicrosoftCustomVision);


            builder.RegisterType<MsTextAnalysisService>()
                .Keyed<ITextAnalysisService>(TextAnalysisServiceType.MicrosoftTextAnalysis);


            builder.RegisterType<LuisNLPService>()
                .Keyed<INLPService>(NlpServiceType.Luis);


            builder.RegisterType<BingSpeechRecognitionService>()
                .Keyed<ISpeechRecognitionService>(SpeechRecognitionServiceType.BingSpeech);

            builder.RegisterModule(new SpeechSynthesizerModule());

        }
    }
}