using Autofac;
using Microsoft.Bot.Builder.Autofac.Base;
using Microsoft.Bot.Builder.Dialogs.Internals;

namespace Carubbi.BotEditor.Api.BotOverrides.Autofac
{
    public class DefaultExceptionMessageOverrideModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterKeyedType<PostUnhandledExceptionToUser, IPostToBot>()
                .InstancePerLifetimeScope();

            builder.RegisterAdapterChain<IPostToBot>
                (
                    typeof(EventLoopDialogTask),
                    typeof(SetAmbientThreadCulture),
                    typeof(QueueDrainingDialogTask),
                    typeof(PersistentDialogTask),
                    typeof(ExceptionTranslationDialogTask),
                    typeof(SerializeByConversation),
                    typeof(PostUnhandledExceptionToUser),
                    typeof(LogPostToBot)
                )
                .InstancePerLifetimeScope();
        }
    }
}