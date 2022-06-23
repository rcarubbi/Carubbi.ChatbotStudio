using Autofac;
using Carubbi.BotEditor.Backend.Domain.Entities;
using Carubbi.BotEditor.Backend.Domain.Integrations;
using Carubbi.BotEditor.Backend.Domain.Models;
using Carubbi.BotEditor.Backend.Domain.Models.Request;
using Carubbi.BotEditor.Backend.Domain.Models.Response;
using Carubbi.BotEditor.Backend.Domain.Repositories;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Extensions;
using Carubbi.BotEditor.Config.Steps;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;

namespace Carubbi.BotEditor.Backend.Domain.Services
{
    public class BotService
    {
        private readonly IBotRepository _botRepository;
        private readonly IBotRuntimeServiceClient _devBotRuntimeServiceClient;
        private readonly IBotRuntimeServiceClient _prodBotRuntimeServiceClient;
        private readonly IChannelRegistrationServiceClient _channelRegistrationServiceClient;

        public BotService(IBotRepository botRepository,
            ILifetimeScope scope)
        {
            _botRepository = botRepository;
            _devBotRuntimeServiceClient = scope.ResolveOptionalNamed<IBotRuntimeServiceClient>("devBotRuntimeServiceClient");
            _prodBotRuntimeServiceClient = scope.ResolveOptionalNamed<IBotRuntimeServiceClient>("prodBotRuntimeServiceClient");
        }

        public IEnumerable<Bot> ListAll()
        {
            return _botRepository.ListAll();
        }

        public Bot GetById(Guid id)
        {
            return _botRepository.GetById(id);
        }

        public Bot Create(BotRequest botRequest, User creator)
        {

            var botConfig = JsonConvert.DeserializeObject<BotConfig>(botRequest.JsonRuntime);
            botConfig.UpdatedAt = DateTime.Now;
            var bot = new Bot
            {
                Name = botConfig.Name,
                CreatedAt = DateTime.Now,
                CreatorId = creator.Id,
            };

            using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    bot = _botRepository.Insert(bot);

                    bot.Versions.Add(new BotVersion
                    {
                        CreatedAt = DateTime.Now,
                        Design = botRequest.XmlDesign,
                        Runtime = botRequest.JsonRuntime,
                        CreatorId = creator.Id,
                        BotId = bot.Id
                    });

                    var version = bot.Versions.Last();
                    _botRepository.InsertVersion(version);

                    botConfig.Id = bot.Id;

                    version.Runtime = JsonConvert.SerializeObject(botConfig);
                    _botRepository.UpdateVersion(version);

                    var response = _devBotRuntimeServiceClient.Create(new BotRuntimeRequest { BotConfig = botConfig, FormSteps = botConfig.GetFormSteps(true) });


                    if (response.FormStepResults.Any(x => !x.Success))
                    {
                        throw new ApplicationException(JoinErrorMessage(response));
                    }

                    scope.Complete();

                    return bot;
                }
                catch (Exception ex)
                {
                    scope.Dispose();
                    throw ex;
                }
            }
        }




        internal List<BotConfig> ListPublishedBotConfigs(Func<BotConfig, bool> predicate)
        {
            var botVersions = _botRepository.ListPublishedBotVersions();
            return ToBotConfigList(botVersions, predicate);
        }

        internal List<BotConfig> ListBotConfigs(Func<BotConfig, bool> predicate)
        {
            var botVersions = _botRepository.ListLastBotVersions();
            return ToBotConfigList(botVersions, predicate);
        }

        private static List<BotConfig> ToBotConfigList(IEnumerable<BotVersion> botVersions, Func<BotConfig, bool> predicate)
        {
            return botVersions
                .ToList()
                .ConvertAll(botVersion => JsonConvert.DeserializeObject<BotConfig>(botVersion.Runtime))
                .Where(predicate)
                .ToList();
        }

        internal int CountLastPublishedBotVersions()
        {
            return _botRepository
                .ListPublishedBotVersions()
                .Count();
        }

        internal int CountLastBotVersions()
        {
            return _botRepository
                .ListLastBotVersions()
                .Count();
        }

        internal bool ContainsAnyBotVersion(Func<BotConfig, bool> predicate, bool published)
        {
            var botVersions = published
                ? _botRepository.ListPublishedBotVersions()
                : _botRepository.ListLastBotVersions();

            return botVersions
             .ToList()
             .ConvertAll(botVersion => JsonConvert.DeserializeObject<BotConfig>(botVersion.Runtime))
             .Any(predicate);
        }

        internal BotConfig GetById(string botId, bool published)
        {
            var botVersion = published
                    ? _botRepository.GetLastPublishedVersionById(botId)
                    : _botRepository.GetLastVersionById(botId);

            var botConfig = JsonConvert.DeserializeObject<BotConfig>(botVersion.Runtime);
            return botConfig;
        }

        public async Task DeactivateAsync(Guid id, User user)
        {
            using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required,
               new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                try
                {
                    var bot = _botRepository.GetById(id);
                    bot.Active = false;
                    bot.LastUpdateUserId = user.Id;
                    _botRepository.Update(bot);

                    var botConfig = JsonConvert.DeserializeObject<BotConfig>(bot.Versions.Last().Runtime);

                    var devResponse = _devBotRuntimeServiceClient.Delete(new BotRuntimeRequest { BotConfig = botConfig, FormSteps = botConfig.GetFormSteps(true) });
                    var prodResponse = _prodBotRuntimeServiceClient.Delete(new BotRuntimeRequest { BotConfig = botConfig, FormSteps = botConfig.GetFormSteps(true) });
                    var channelRegistrationResponse = await _channelRegistrationServiceClient.UnregisterAsync(new ChannelRegistrationRequest { BotId = botConfig.Id });

                    if (!channelRegistrationResponse.Success)
                    {
                        throw new ApplicationException(JoinErrorMessage(channelRegistrationResponse));
                    }


                    if (devResponse.FormStepResults.Any(x => !x.Success))
                    {
                        throw new ApplicationException(JoinErrorMessage(devResponse));
                    }

                    if (prodResponse != null && prodResponse.FormStepResults.Any(x => !x.Success))
                    {
                        throw new ApplicationException(JoinErrorMessage(prodResponse));
                    }

                    scope.Complete();
                }
                catch (Exception ex)
                {
                    scope.Dispose();
                    throw ex;
                }
            }

        }

        public void Update(BotRequest botRequest, User updateUser)
        {
            var newBotConfig = JsonConvert.DeserializeObject<BotConfig>(botRequest.JsonRuntime);

            var bot = _botRepository.GetById(botRequest.Id);
            bot.Name = newBotConfig.Name;
            bot.LastUpdateUserId = updateUser.Id;
            bot.UpdatedAt = DateTime.Now;

            BotVersion lastDevVersion = null;
            BotUpdateChanges botUpdateChanges = new BotUpdateChanges();

            using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted },
                TransactionScopeAsyncFlowOption.Enabled))
            {
                try
                {
                    if (bot.Versions.All(x => x.PublishedAt.HasValue))
                    {
                        var lastProdVersion = bot.Versions.FindLast(x => x.PublishedAt.HasValue);

                        botUpdateChanges = PrepareUpdate(newBotConfig, lastProdVersion);

                        lastDevVersion = new BotVersion
                        {
                            CreatedAt = DateTime.Now,
                            Design = botRequest.XmlDesign,
                            Runtime = botUpdateChanges.Runtime,
                            CreatorId = updateUser.Id,
                            BotId = bot.Id,
                        };
                        _botRepository.InsertVersion(lastDevVersion);
                    }
                    else
                    {
                        lastDevVersion = bot.Versions.FindLast(x => !x.PublishedAt.HasValue);

                        botUpdateChanges = PrepareUpdate(newBotConfig, lastDevVersion);

                        lastDevVersion.Design = botRequest.XmlDesign;
                        lastDevVersion.Runtime = botUpdateChanges.Runtime;
                        lastDevVersion.UpdatedAt = DateTime.Now;
                        lastDevVersion.LastUpdateUserId = updateUser.Id;
                        _botRepository.Update(bot);
                        _botRepository.UpdateVersion(lastDevVersion);

                    }

                    var response = _devBotRuntimeServiceClient.Update(new BotRuntimeRequest { BotConfig = newBotConfig, FormSteps = botUpdateChanges.FormStepsToUpdate });

                    if (response.FormStepResults.Any(x => !x.Success))
                    {
                        throw new ApplicationException(JoinErrorMessage(response));
                    }

                    scope.Complete();
                }
                catch (Exception ex)
                {
                    scope.Dispose();
                    throw ex;
                }
            }
        }

        private static string JoinErrorMessage(BotRuntimeResponse response)
        {
            var stbErrors = new StringBuilder();
            foreach (var buildResult in response.FormStepResults)
            {
                var messages = string.Join(Environment.NewLine, buildResult.ErrorMessages.Select(msg => $"Erro no passo {buildResult.StepId}: {string.Join(Environment.NewLine, msg)}"));

                stbErrors.AppendLine(messages);
            }

            return stbErrors.ToString();
        }

        private BotUpdateChanges PrepareUpdate(BotConfig newBotConfig, BotVersion currentVersion)
        {
            var currentBotConfig = JsonConvert.DeserializeObject<BotConfig>(currentVersion.Runtime);
            var newFormSteps = newBotConfig.GetFormSteps(true);

            newBotConfig.Id = currentBotConfig.Id;

            var formStepsProdVersion = currentBotConfig.GetFormSteps(false);

            newFormSteps.ForEach(x => x.Version = (formStepsProdVersion.SingleOrDefault(y => y.Id == x.Id) ?? new FormStep()).Version);

            var formStepsToUpdate = newFormSteps
                .Where(x =>
                    JsonConvert.SerializeObject(x).GetHashCode() !=
                    (formStepsProdVersion.SingleOrDefault(y => y.Id == x.Id) ?? new FormStep()).Hash)
                .ToList();

            formStepsToUpdate.ForEach(x => x.Version++);
            newFormSteps.ForEach(x => x.Hash = JsonConvert.SerializeObject(x).GetHashCode());
            newBotConfig.UpdatedAt = DateTime.Now;



            var runtime = JsonConvert.SerializeObject(newBotConfig);

            return new BotUpdateChanges
            {
                Runtime = runtime,
                FormStepsToUpdate = formStepsToUpdate
            };
        }

        public async Task PublishAsync(Guid id, User publisher)
        {
            using (TransactionScope scope = new TransactionScope(TransactionScopeOption.Required,
                new TransactionOptions { IsolationLevel = IsolationLevel.ReadCommitted }))
            {
                try
                {
                    var bot = _botRepository.GetById(id);
                    bot.UpdatedAt = DateTime.Now;
                    bot.LastUpdateUserId = publisher.Id;
                    _botRepository.Update(bot);

                    var botConfig = JsonConvert.DeserializeObject<BotConfig>(bot.Versions.Last().Runtime);

                    var lastDevVersion = bot.Versions.Where(x => !x.PublishedAt.HasValue).LastOrDefault();
                    if (lastDevVersion != null)
                    {
                        lastDevVersion.PublishedAt = DateTime.Now;
                        lastDevVersion.PublisherId = publisher.Id;
                        _botRepository.UpdateVersion(lastDevVersion);
                    }

                    var response = bot.Versions.Any(x => x.PublishedAt != null)
                        ? _prodBotRuntimeServiceClient.Update(new BotRuntimeRequest { BotConfig = botConfig, FormSteps = PrepareUpdate(botConfig, lastDevVersion).FormStepsToUpdate })
                        : _prodBotRuntimeServiceClient.Create(new BotRuntimeRequest { BotConfig = botConfig, FormSteps = botConfig.GetFormSteps(true) });


                    if (response.FormStepResults.Any(x => !x.Success))
                    {
                        throw new ApplicationException(JoinErrorMessage(response));
                    }

                    var channelRegistrationResponse = await _channelRegistrationServiceClient.RegisterAsync(new ChannelRegistrationRequest { BotId = botConfig.Id, Channels = botConfig.Channels });

                    if (!channelRegistrationResponse.Success)
                    {
                        throw new ApplicationException(JoinErrorMessage(channelRegistrationResponse));
                    }

                    scope.Complete();
                }
                catch (Exception ex)
                {
                    scope.Dispose();
                    throw ex;
                }
            }
        }

        private string JoinErrorMessage(ChannelRegistrationResponse channelRegistrationResponse)
        {
            var stbErrors = new StringBuilder();


            foreach (var message in channelRegistrationResponse.ErrorMessages)
            {
                stbErrors.AppendLine(message);

            }

            return stbErrors.ToString();
        }
    }
}