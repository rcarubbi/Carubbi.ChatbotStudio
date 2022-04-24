using Autofac;
using Carubbi.BotEditor.Api.State;
using Carubbi.BotEditor.Config;
using Microsoft.Bot.Builder.Azure;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Builder.History;
using Microsoft.Bot.Connector;
using System.Collections.Concurrent;

namespace Carubbi.BotEditor.Api.BotOverrides.Autofac
{
    internal class BotDataStoreModule : Module
    {
        private readonly BotInstanceSettings _settings;
        private static ConcurrentDictionary<string, IBotDataStore<BotData>> botDataStores = new ConcurrentDictionary<string, IBotDataStore<BotData>>();
        private static ConcurrentDictionary<string, IActivityLogger> activityLoggers = new ConcurrentDictionary<string, IActivityLogger>();

        public BotDataStoreModule(BotInstanceSettings settings)
        {
            _settings = settings;
        }

        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(ctx => new MultiBotMicrosoftAppCredentials(_settings.AppId, _settings.AppPassword))
                .As<MicrosoftAppCredentials>();
                
            builder.Register(ctx =>
            {
                IActivityLogger activityLogger = null;

                switch (_settings.PersistenceStrategy)
                {
                    case PersistenceStrategies.AzureTables:
                        activityLogger = new AzureTablesActivityLogger(_settings);
                        break;
                    case PersistenceStrategies.SqlServer:
                        activityLogger = new SqlActivityLogger(_settings);
                        break;
                    default:
                        activityLogger = new NullActivityLogger();
                        break;
                }

                if (ShouldUpdateInjectionOnDictionary(activityLoggers, activityLogger))
                {
                    activityLoggers.AddOrUpdate(_settings.BotId, activityLogger, (botId, currentLogger) => activityLogger);
                }
                else
                {
                    activityLoggers.TryGetValue(_settings.BotId, out activityLogger);
                }

                return activityLogger;
            })
            .As<IActivityLogger>()
            .InstancePerDependency();

            builder.Register(ctx =>
            {
                IBotDataStore<BotData> botDataStore = null;

                switch (_settings.PersistenceStrategy)
                {
                    case PersistenceStrategies.AzureTables:
                        botDataStore = new TableBotDataStore2(_settings.ConnectionString);
                        break;
                    case PersistenceStrategies.SqlServer:
                        botDataStore = new SqlServerBotDataStore(_settings.ConnectionString);
                        break;
                    default:
                        botDataStore = new InMemoryDataStore();
                        break;
                }

                if (ShouldUpdateInjectionOnDictionary(botDataStores, botDataStore))
                {
                    botDataStores.AddOrUpdate(_settings.BotId, botDataStore, (botId, currentDataStore) => botDataStore);
                }
                else
                {
                    botDataStores.TryGetValue(_settings.BotId, out botDataStore);
                }

                return botDataStore;
            })
            .Keyed<IBotDataStore<BotData>>(AzureModule.Key_DataStore)
            .AsSelf()
            .SingleInstance();


            builder.Register(c =>
            {
                var store = c.ResolveKeyed<IBotDataStore<BotData>>(AzureModule.Key_DataStore);
                return new CachingBotDataStore(store, CachingBotDataStoreConsistencyPolicy.LastWriteWins);
            }).As<IBotDataStore<BotData>>()
            .AsSelf()
            .SingleInstance();
        }

        private bool ShouldUpdateInjectionOnDictionary<T>(ConcurrentDictionary<string, T> dictionary, T value)
        {
            return (dictionary.ContainsKey(_settings.BotId) &&
                            value.GetType() != dictionary[_settings.BotId].GetType()) || !dictionary.ContainsKey(_settings.BotId);
        }
    }
}