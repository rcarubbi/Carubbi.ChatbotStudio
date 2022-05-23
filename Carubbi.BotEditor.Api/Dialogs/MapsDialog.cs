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
        private readonly IMapsService _mapsService;

        public MapsDialog(BotConfig botConfig, CompositeStep parentStep, MapsStep step)
            : base(botConfig, parentStep, step)
        {
            _mapsService = Conversation.Container.ResolveKeyed<IMapsService>(_step.ServiceType, new TypedParameter(typeof(string), _step.ApiKey));
            if (_step.Output == null) _step.Output = new MapsOutput();
        }

        public IEnumerable<HeroCard> CreateHeroCards(IList<Location> locations, IList<string> locationNames = null, IList<string> locationIds = null)
        {
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
                    var image = new CardImage(url: _mapsService.GetLocationMapImageUrl(location, i), alt: locationString);
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
            var locations = (await ParseLocations(_step.Input)).ToList();
            _step.Output.Locations = locations;
            PersistOutput(context, _step.Output);

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

        private async Task<IEnumerable<Location>> ParseLocations(List<LocationSource> input)
        {
            var locations = new List<Location>();

            if (DataSource != null)
            {
                foreach (var item in DataSource)
                {
                    var location = input.First();
                    locations.Add(await ParseLocation(location, item));
                }
            }
            else
            {
                foreach (var item in input)
                {
                    locations.Add(await ParseLocation(item, null));
                }
            }
            return locations;
        }

        private async Task<Location> ParseLocation(LocationSource locationSource, object item)
        {
            var id = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.Id), item).ToString();
            var address = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.Address), item).ToString();
            var city = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.City), item).ToString();
            var validLatitude = double.TryParse(_expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.Latitude), item).ToString(), out var latitude);
            var validLongitude = double.TryParse(_expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.Longitude), item).ToString(), out var longitude);
            var state = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.State), item).ToString();
            var name = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.Name), item).ToString();
            var zip = _expressionEvaluator.Evaluate(_expressionEvaluator.PrepareMessage(_step.Id, locationSource.ZipCode), item).ToString();
            var formattedAddress = $"{address}, {city} - {state} - {zip}";
            var locationSet = await _mapsService.GetLocationsByQueryAsync(formattedAddress);
            if (locationSet.Locations.Any())
            {
                var location = locationSet.Locations.First();
                location.Name = name;
                return location;
            }
            else
            {
                return new Location
                {
                    Address = new Address { FormattedAddress = $"{address}, {city} - {state} - {zip}", AddressLine = address },
                    GeocodePoints = validLatitude && validLongitude
                    ? new List<GeocodePoint> { new GeocodePoint { Coordinates = new List<double> { latitude, longitude } } }
                    : null,
                    Name = name,
                    Id = id,
                    Point = validLatitude && validLongitude
                    ? new GeocodePoint { Coordinates = new List<double> { latitude, longitude } }
                    : null
                };
            }
        }

        private async Task LocationSelectedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var activity = await result;
            var location = (await ParseLocations(_step.Input)).SingleOrDefault(x => x.Id == activity.Text);

            _step.Output.SelectedLocation = location;
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