using Autofac;
using Carubbi.BotEditor.Services.SpeechSysthesizer;
using Carubbi.BotEditor.Config;

namespace Carubbi.BotEditor.Services.Autofac
{
    internal class SpeechSynthesizerModule : Module
    {
        private static ISpeechSynthesizerCache _singletonCache = new InMemorySpeechSynthesizerCache();

        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<BingSpeechSynthesizerService>()
                .Keyed<ISpeechSynthesizerService>(SpeechSynthesisServiceType.BingSpeech)
                .SingleInstance();

            builder.RegisterInstance(_singletonCache)
                .Keyed<ISpeechSynthesizerCache>(SpeechSynthesisCacheType.InMemory)
                .SingleInstance();

            builder.RegisterType<FileSystemSpeechSynthesizerStore>()
                 .Keyed<ISpeechSynthesizerStore>(SpeechSynthesisStoreType.FileSystem)
                 .InstancePerLifetimeScope();

            builder.RegisterType<SpeechSynthesizerManager>().AsSelf().SingleInstance();
        }
    }
}