using Autofac;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.NLP;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.Services.Nlp;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class ListDialog : BaseDialog<object, ListStep>
    {
        private int _retries;

        public ListDialog(BotConfig botConfig, CompositeStep parentStep, ListStep step)
            : base(botConfig, parentStep, step)
        {
            _retries = 0;
            _step.Output = new ListStepResult();
        }

        protected override async Task PerformStartAsync(IDialogContext context)
        {
            await ShowListAsync(context);
        }

        private async Task ShowListAsync(IDialogContext context)
        {
            var promptMessage = await CreateActivityWithMessage(context, _step.PromptMessage, Constants.DEFAULT_LIST_PROMPT_MESSAGE);

            switch (_step.ListType)
            {
                case ListTypes.ImageList:
                    AddListItems(promptMessage, addAsMultipleAttachmentHandler: CreateThumbnailCardWithTap);
                    break;
                case ListTypes.ImageButtonList:
                    AddListItems(promptMessage, addAsMultipleAttachmentHandler: CreateThumbnailCardWithButton);
                    break;
                case ListTypes.ButtonList:
                    AddListItems(promptMessage, addAsSingleAttachmentHandler: CreateHeroCardWithButtons);
                    break;
                default:
                    break;
            }
            await context.PostAsync(promptMessage);
            context.Wait(ResumeAfterListOptionSelectedAsync);

        }

        private void AddListItems(IMessageActivity promptMessage,
           Func<ListItem, Attachment> addAsMultipleAttachmentHandler = null,
           Func<List<ListItem>, Attachment> addAsSingleAttachmentHandler = null)
        {
            promptMessage.AttachmentLayout = promptMessage.Attachments.Count == 0
                    ? AttachmentLayoutTypes.Carousel
                    : AttachmentLayoutTypes.List;

            var items = new List<ListItem>();
            if (DataSource == null)
            {
                foreach (var option in _step.Input.OrderBy(x => x.Order))
                {
                    ListItem evaluatedOption = new ListItem
                    {
                        Title = _expressionEvaluator.Evaluate(option.Title, null).ToString(),
                        Subtitle = _expressionEvaluator.Evaluate(option.Subtitle, null).ToString(),
                        ImageUrl = _expressionEvaluator.Evaluate(option.ImageUrl, null).ToString(),
                        ButtonTitle = _expressionEvaluator.Evaluate(option.ButtonTitle, null).ToString(),
                        ButtonValue = _expressionEvaluator.Evaluate(option.ButtonValue, null).ToString(),
                        Action = option.Action,
                    };

                    items.Add(evaluatedOption);

                    if (addAsMultipleAttachmentHandler != null) promptMessage.Attachments.Add(addAsMultipleAttachmentHandler(evaluatedOption));
                }
            }
            else
            {
                var option = _step.Input.First();
                foreach (var item in DataSource)
                {
                    ListItem evaluatedOption = new ListItem
                    {
                        Title = _expressionEvaluator.Evaluate(option.Title, item).ToString(),
                        Subtitle = _expressionEvaluator.Evaluate(option.Subtitle, item).ToString(),
                        ImageUrl = _expressionEvaluator.Evaluate(option.ImageUrl, item).ToString(),
                        ButtonTitle = _expressionEvaluator.Evaluate(option.ButtonTitle, item).ToString(),
                        ButtonValue = _expressionEvaluator.Evaluate(option.ButtonValue, item).ToString(),
                        Action = option.Action,
                    };

                    items.Add(evaluatedOption);

                    if (addAsMultipleAttachmentHandler != null) promptMessage.Attachments.Add(addAsMultipleAttachmentHandler(evaluatedOption));
                }
            }

            if (addAsSingleAttachmentHandler != null) promptMessage.Attachments.Add(addAsSingleAttachmentHandler(items));
        }

        private Attachment CreateThumbnailCardWithTap(ListItem option)
        {
            var card = new ThumbnailCard
            {
                Title = option.Title,
                Subtitle = option.Subtitle,
                Images = new List<CardImage>(),
                Tap = CreateCardAction(option)
            };

            if (!string.IsNullOrWhiteSpace(option.ImageUrl))
            {
                card.Images.Add(CreateCardImage(option));
            }

            return card.ToAttachment();
        }

        private Attachment CreateThumbnailCardWithButton(ListItem evaluatedOption)
        {
            var card = new ThumbnailCard
            {
                Title = evaluatedOption.Title,
                Subtitle = evaluatedOption.Subtitle,
                Images = new List<CardImage>(),
                Buttons = new List<CardAction>
                {
                    CreateCardAction(evaluatedOption)
                }
            };

            if (!string.IsNullOrWhiteSpace(evaluatedOption.ImageUrl))
            {
                card.Images.Add(CreateCardImage(evaluatedOption));
            }

            return card.ToAttachment();
        }

        private Attachment CreateHeroCardWithButtons(List<ListItem> listItems)
        {
            HeroCard card = new HeroCard();
            card.Buttons = new List<CardAction>();

            foreach (var item in listItems)
            {
                card.Buttons.Add(CreateCardAction(item));
            }

            return card.ToAttachment();
        }

        private async Task ResumeAfterListOptionSelectedAsync(IDialogContext context, IAwaitable<object> result)
        {
            var activity = await result as IMessageActivity;
            ListItem item = null;
            if (int.TryParse(activity.Text, out var numericAnswer))
            {
                item = _step.Input
                    .Where((input, index) =>
                    {
                        var lookupIndex = input.Order > 0 ? input.Order : index + 1;
                        return lookupIndex == numericAnswer;
                    }).FirstOrDefault();
            }
            else
            {
                item = _step.Input
                    .FirstOrDefault(x => (x.ButtonValue ?? x.Title).Equals(activity.Text, StringComparison.CurrentCultureIgnoreCase));
            }

            if (item != null)
            {
                CallTargetDialog(item, context);
            }
            else if (_step.NLPSettings != null)
            {
                await TryResolveListItemThroughNLPAsync(context, activity.Text, item);
            }
            else
            {
                _retries++;
                if (_retries >= (_step.Attempts ?? 3))
                {
                    var messageActivity = await CreateActivityWithMessage(context, _step.TooManyAttemptsMessage, Constants.DEFAULT_TOO_MANY_ATTEMPTS_MESSAGE);
                    await context.PostAsync(messageActivity);
                    context.Done<object>(null);
                }
                else
                {
                    var retryMessage = await CreateActivityWithMessage(context, _step.RetryMessage, Constants.DEFAULT_RETRY_MESSAGE);
                    await context.PostAsync(retryMessage);
                    await ShowListAsync(context);
                }
            }
        }

        private CardAction CreateCardAction(ListItem option)
        {
            return new CardAction(ParseAction(option.Action),
                                          title: string.IsNullOrWhiteSpace(option.ButtonTitle)
                                              ? option.Title
                                              : option.ButtonTitle,
                                          image: null,
                                          value: string.IsNullOrWhiteSpace(option.ButtonValue)
                                                        ? string.IsNullOrWhiteSpace(option.ButtonTitle)
                                                            ? option.Title
                                                            : option.ButtonTitle
                                                        : option.ButtonValue,
                                          displayText: option.Title);
        }

        private static CardImage CreateCardImage(ListItem option)
        {
            return new CardImage(option.ImageUrl);
        }

        private void CallTargetDialog(ListItem item, IDialogContext context)
        {
            _step.Output.SelectedListItem = item;
            PersistOutput(context, _step.Output);

            if (item.TargetStepId > 0)
            {
                var targetStep = GetStep(item.TargetStepId);
                var targetDialog = targetStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                context.Call(targetDialog, GoBack);

            }
            else if (_step.NextStepId.HasValue)
            {
                var nextStep = GetStep(_step.NextStepId.Value);
                var nextDialog = nextStep.MakeDialog(_botConfig, context.Activity, _parentStep);
                context.Call(nextDialog, GoBack);
            }
            else
            {
                context.Done<object>(null);
            }
        }

        private async Task TryResolveListItemThroughNLPAsync(IDialogContext context, string text, ListItem item)
        {
            INLPService nlpService = Conversation.Container
                    .ResolveKeyed<INLPService>(_step.NLPSettings.ServiceType,
                    new TypedParameter(typeof(Settings), _step.NLPSettings));

            var nlpResult = await nlpService.GetTopScoringResultAsync(text);
            _step.Output.NLPResult = nlpResult;
            PersistOutput(context, _step.Output);

            item = _step.Input.FirstOrDefault(x => x.ButtonValue == nlpResult.Intent.Name);
            if (item != null)
            {
                CallTargetDialog(item, context);
            }
            else
            {
                _retries++;
                if (_retries >= (_step.Attempts ?? 3))
                {
                    var messageActivity = await CreateActivityWithMessage(context, _step.TooManyAttemptsMessage, Constants.DEFAULT_TOO_MANY_ATTEMPTS_MESSAGE);
                    await context.PostAsync(messageActivity);
                    context.Done<object>(null);
                }
                else
                {
                    var retryMessage = await CreateActivityWithMessage(context, _step.RetryMessage, Constants.DEFAULT_RETRY_MESSAGE);
                    await context.PostAsync(retryMessage);
                    await ShowListAsync(context);
                }
            }
        }

        private string ParseAction(ItemActions action)
        {
            switch (action)
            {
                case ItemActions.OpenURL:
                    return ActionTypes.OpenUrl;
                case ItemActions.DownloadFile:
                    return ActionTypes.DownloadFile;
                default:
                    return ActionTypes.PostBack;
            }
        }
    }
}