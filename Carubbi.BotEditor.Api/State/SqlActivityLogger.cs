using AutoMapper;
using Carubbi.BotEditor.Config;
using Microsoft.Bot.Builder.History;
using Microsoft.Bot.Connector;
using System;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.State
{
    public class SqlActivityLogger : IActivityLogger
    {
        private readonly BotInstanceSettings _settings;

        private readonly IMapper _mapper;

        public SqlActivityLogger(BotInstanceSettings settings)
        {
            var mapperConfig = new MapperConfiguration(cfg => {
                cfg.CreateMap<IMessageActivity, SqlBotActivityLogEntity>()
                .ForMember(dest => dest.FromId, opt => opt.MapFrom(src => src.From.Id))
                .ForMember(dest => dest.RecipientId, opt => opt.MapFrom(src => src.Recipient.Id))
                .ForMember(dest => dest.FromName, opt => opt.MapFrom(src => src.From.Name))
                .ForMember(dest => dest.RecipientName, opt => opt.MapFrom(src => src.Recipient.Name));
            });

            _mapper = mapperConfig.CreateMapper();

            _settings = settings;
        }

        public async Task LogAsync(IActivity activity)
        {
            IMessageActivity msg = activity.AsMessageActivity();

            using (var context = new SqlBotDataContext(_settings.ConnectionString))
            {
                var activityEntity = _mapper.Map<SqlBotActivityLogEntity>(msg);
                if (string.IsNullOrEmpty(activityEntity.Id))
                    activityEntity.Id = Guid.NewGuid().ToString();
                context.ActivityLog.Add(activityEntity);
                await context.SaveChangesAsync();
            }
        }

    }
}