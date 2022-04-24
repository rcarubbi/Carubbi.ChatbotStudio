using Carubbi.BotEditor.Config;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Builder.Internals.Fibers;
using Microsoft.Bot.Connector;
using System;
using System.Diagnostics;
using System.Net.Mime;
using System.Resources;
using System.Threading;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.BotOverrides
{
    public class PostUnhandledExceptionToUser : IPostToBot
    {
        private readonly IPostToBot _inner;
        private readonly IBotToUser _botToUser;
        private readonly TraceListener _trace;

        public PostUnhandledExceptionToUser(IPostToBot inner, IBotToUser botToUser, ResourceManager resources, TraceListener trace)
        {
            SetField.NotNull(out _inner, nameof(inner), inner);
            SetField.NotNull(out _botToUser, nameof(botToUser), botToUser);
            SetField.NotNull(out _, nameof(resources), resources);
            SetField.NotNull(out _trace, nameof(trace), trace);
        }

        async Task IPostToBot.PostAsync(IActivity activity, CancellationToken token)
        {
            try
            {
                await _inner.PostAsync(activity, token);
            }
            catch (ErrorResponseException errorResp)
            {
                try
                {
                    if (Debugger.IsAttached)
                    {
                        var message = _botToUser.MakeMessage();
                        message.Text = $"Exceção: {errorResp.Response.Content}";
                        await _botToUser.PostAsync(message, token);
                    }
                    else
                    {
                        await _botToUser.PostAsync(Constants.PRECONDITION_FAILED_EXCEPTION_MESSAGE, cancellationToken: token);
                    }
                }
                catch (Exception e)
                {
                    _trace.WriteLine(e);
                }
                throw;

            }
            catch (Exception error) { 
                try
                {
                    if (Debugger.IsAttached)
                    {
                        var message = _botToUser.MakeMessage();
                        message.Text = $"Exceção: { error.Message}";
                        message.Attachments = new[]
                        {
                            new Attachment(MediaTypeNames.Text.Plain, content: error.StackTrace)
                        };

                        await _botToUser.PostAsync(message, token);
                    }
                    else
                    {
                        await _botToUser.PostAsync(Constants.PRECONDITION_FAILED_EXCEPTION_MESSAGE, cancellationToken: token);
                    }
                }
                catch (Exception e)
                {
                    _trace.WriteLine(e);
                }
                throw;

            }
        }
    }
}