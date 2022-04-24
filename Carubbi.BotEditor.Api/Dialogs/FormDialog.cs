using Carubbi.BotEditor.Api.Forms;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using Carubbi.BotEditor.FormsIntegration;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Internals;
using Microsoft.Bot.Builder.FormFlow;
using Microsoft.Bot.Builder.Luis.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Api.Dialogs
{
    [Serializable]
    public class FormDialog : BaseDialog<object, FormStep>
    {
        

        public FormDialog(BotConfig botConfig, CompositeStep parentStep, FormStep step)
            : base(botConfig, parentStep, step)
        {
            _step.Output = new FormResult();
        }

        protected override Task PerformStartAsync(IDialogContext context)
        {
            ReflectState(context);
            //Debugar(context);

            return Task.CompletedTask;
        }

        //private void Debugar(IDialogContext context)
        //{
        //    var instance = new Step2(context.PrivateConversationData, _step, _botConfig);
        //    var callback = new StateCallBack();
        //    callback.OnStateCompleted += Callback_OnStateCompleted;
        //    instance.Callback = callback;
        //    var dialog = new FormDialog<Step2>(instance, instance.BuildForm, FormOptions.PromptInStart, null, new CultureInfo("pt-BR"));
        //    context.Call(dialog, instance.ResumeAfterInput);
        //}

        private void ReflectState(IDialogContext context)
        {
            var formStepLoader = new FormStepLoader(_botConfig);
            var stateType = formStepLoader.LoadForm(_step);

            if (_step.ContainsRestoreFields()) LoadRestoreField(context);
            if (_step.HasNlpEntitiesToAttach()) AttachNlpEntities(context);

            var stateInstance = Activator.CreateInstance(stateType, new object[] { context.PrivateConversationData, _step, _botConfig });

            var callback = new StateCallBack();
            callback.OnStateCompleted += Callback_OnStateCompleted;
            stateType.GetProperty(Constants.CALLBACK_PROPERTY).SetValue(stateInstance, callback);

            var formDialogType = typeof(FormDialog<>).MakeGenericType(stateType);
            var buildFormDelegateType = typeof(BuildFormDelegate<>).MakeGenericType(stateType);

            var buildFormDelegate = Delegate.CreateDelegate(buildFormDelegateType, stateInstance, Constants.BUILDFORM_METHOD);

            var formDialogConstr = formDialogType.GetConstructor(new Type[] {
                stateType,
                buildFormDelegateType,
                typeof(FormOptions),
                typeof(IEnumerable<EntityRecommendation>),
                typeof(CultureInfo) });

            var formDialog = formDialogConstr.Invoke(new object[] {
                stateInstance,
                buildFormDelegate,
                FormOptions.PromptInStart,
                null,
                null
            });

            var resumeAfterType = typeof(ResumeAfter<>).MakeGenericType(stateType);
            var resumeAfterDelegate = Delegate.CreateDelegate(resumeAfterType, stateInstance, Constants.RESUME_AFTER_INPUT_METHOD);

            var callMethodInfo = typeof(IDialogStack).GetMethod(Constants.CALL_METHOD).MakeGenericMethod(stateType);
            callMethodInfo.Invoke(context, new object[] { formDialog, resumeAfterDelegate });
        }

        private void AttachNlpEntities(IDialogContext context)
        {
            var entities = _botConfig.GetNLPEntities();

            foreach (var field in _step.GetFieldsWithNlpEntities())
            {
                var entity = entities.FirstOrDefault(x => x.Type.Equals(field.NlpEntityName, StringComparison.CurrentCultureIgnoreCase));
                if (entity != null) context.PrivateConversationData.SetValue(string.Format(Constants.ENTITY_PRIVATE_CONVERSATION_DATA_KEY_PATTERN, field.Name, field.Id), entity.Name);
            }
        }

        private void LoadRestoreField(IDialogContext context)
        {
            var storeFields = _step.GetStoredFields();

            foreach (var field in storeFields)
            {
                if (context.UserData.TryGetValue($"{field.Name}|{field.Id}", out string restoredValue))
                {
                    context.PrivateConversationData.SetValue($"{field.Name}|{field.Id}", restoredValue);
                }
            }
        }

        private void Callback_OnStateCompleted(object sender, StateEventArgs e)
        {

            _step.Output.Form = e.State;
            _step.Output.FormCancelled = e.FormCancelled;
            

            PersistOutput(e.Context, _step.Output);

            if (_step.NextStepId.HasValue)
            {
                var nextStep = GetStep(_step.NextStepId.Value);
                var dialog = nextStep.MakeDialog(_botConfig, e.Context.Activity, _parentStep);
                e.Context.Call(dialog, GoBack);
            }
            else
            {
                e.Context.Done<object>(null);
            }

        }

       
    }
}