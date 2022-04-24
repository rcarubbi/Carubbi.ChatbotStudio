using Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Maps;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Services.Maps;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Address = Carubbi.BotEditor.Config.Maps.Address;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class MapsDialog : BaseDialog<object, MapsStep>
    {
        public MapsDialog(BotConfig botConfig, CompositeStep parentStep, MapsStep step)
            : base(botConfig, parentStep, step)
        {
        }

        public IEnumerable<HeroCard> CreateHeroCards(IList<Location> locations, IList<string> locationNames = null, IList<string> locationIds = null)
        {
            var mapsService = Conversation.Container.ResolveKeyed<IMapsService>(_step.ServiceType, new TypedParameter(typeof(string), _step.ApiKey));
            var cards = new List<HeroCard>();

            int i = 1;

            foreach (var location in locations)
            {
                string nameString = locationNames == null ? string.Empty : $"{locationNames[i - 1]}: ";
                string locationString = $"{nameString}{location.GetFormattedAddress(",")}";
                string address = locationString;

                var heroCard = new HeroCard
                {
                    Subtitle = address
                };

                if (location.Point != null)
                {
                    var image = new CardImage(url: mapsService.GetLocationMapImageUrl(location, i));
                    heroCard.Images = new[] { image };
                }
                if (locationIds != null)
                    heroCard.Buttons = new List<CardAction> { new CardAction(ActionTypes.PostBack, Constants.MAP_SELECT_BUTTON_TEXT, null, locationIds[i - 1]) };

                cards.Add(heroCard);

                i++;
            }

            return cards;
        }


        protected override async Task PerformStartAsync(IDialogContext context)
        {
            var message = context.MakeMessage();
            message.AttachmentLayout = AttachmentLayoutTypes.Carousel;
            var locations = ParseLocations(_step.Input).ToList();

            var cards = CreateHeroCards(locations,
                locations.Select(x => x.Name).ToArray(),
                _step.Selectable 
                    ? locations.Select(x => x.Id).ToArray() 
                    : null);

            foreach (var card in cards)
            {
                message.Attachments.Add(card.ToAttachment());
            }

            await context.PostAsync(message);

            if (_step.Selectable)
                context.Wait(LocationSelectedAsync);
            else
            {
                if (_step.NextStepId.HasValue)
                {
                    var nextStep = GetStep(_step.NextStepId.Value);
                    var dialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                    context.Call(dialog, GoBack);
                }
                else
                {
                    context.Done<object>(null);
                }
            }
        }

        private IEnumerable<Location> ParseLocations(List<LocationSource> input)
        {
            if (DataSource != null)
            {
                foreach (var item in DataSource)
                {
                    var location = input.First();
                    yield return ParseLocation(location, item);
                }
            }
            else
            {
                foreach (var item in input)
                {
                    yield return ParseLocation(item, null);
                }
            }
        }

        private Location ParseLocation(LocationSource locationSource, object item)
        {
            var id = _expressionEvaluator.Evaluate(locationSource.Id, item).ToString();
            var address = _expressionEvaluator.Evaluate(locationSource.Address, item).ToString();
            var city = _expressionEvaluator.Evaluate(locationSource.City, item).ToString();
            var latitude = Convert.ToDouble(_expressionEvaluator.Evaluate(locationSource.Latitude, item));
            var longitude = Convert.ToDouble(_expressionEvaluator.Evaluate(locationSource.Longitude, item));
            var state = _expressionEvaluator.Evaluate(locationSource.State, item).ToString();
            var name = _expressionEvaluator.Evaluate(locationSource.Name, item).ToString();
            var zip = _expressionEvaluator.Evaluate(locationSource.ZipCode, item).ToString();

            return new Location
            {
                Address = new Address { FormattedAddress = $"{address}, {city} - {state} - {zip}", AddressLine = address },
                GeocodePoints = new List<GeocodePoint> { new GeocodePoint { Coordinates = new List<double> { latitude, longitude } } },
                Name = name,
                Id = id,
                Point = new GeocodePoint { Coordinates = new List<double> { latitude, longitude } }
            };
        }

        private async Task LocationSelectedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var activity = await result;
            var location = ParseLocations(_step.Input).SingleOrDefault(x => x.Id == activity.Text);

            _step.Output = location;
            PersistOutput(context, _step.Output);

            if (_step.NextStepId.HasValue)
            {
                var nextStep = GetStep(_step.NextStepId.Value);
                var dialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                context.Call(dialog, GoBack);
            }
            else
            {
                context.Done<object>(null);
            }
        }
    }
}