using Carubbi.BotEditor.Backend.Domain.Models.Response;
using Carubbi.BotEditor.Config;
using Carubbi.BotEditor.Config.Steps;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Web.Hosting;

namespace Carubbi.BotEditor.Api.Forms
{
    public class FormStepService
    {
        private readonly BotConfig _botConfig;
        private readonly FormStepBuilder _formStepBuilder;
        private static object _rootSync = new object();

        public FormStepService(BotConfig botConfig)
        {
            _botConfig = botConfig;
            _formStepBuilder = new FormStepBuilder();
        }

        public BotRuntimeResponse CreateForms(IEnumerable<FormStep> formSteps)
        {
            var response = new BotRuntimeResponse();
            foreach (FormStep formStep in formSteps)
            {
                response.FormStepResults.Add(CreateNewVersion(formStep));
            }
            return response;
        }

        public BotRuntimeResponse UpdateForms(IEnumerable<FormStep> formSteps)
        {
            try
            {
                ClearForms();
            }
            catch
            {

            }
            return CreateForms(formSteps);
        }

        public void ClearForms()
        {
            if (File.Exists(_botConfig.GetDynamicStateBasePath()))
            File.Delete(_botConfig.GetDynamicStateBasePath());
        }

        private FormStepResult CreateNewVersion(FormStep formStep)
        {
            lock (_rootSync)
            {
                FormStepResult response = null;
                HostingEnvironment.QueueBackgroundWorkItem((token) =>
                {
                    response = _formStepBuilder.Build(_botConfig, formStep);
                });

                Stopwatch sw = new Stopwatch();
                sw.Start();
                var oneMinute = new TimeSpan(0, 1, 0);
                while (response == null && sw.Elapsed < oneMinute)
                {
                    Thread.Sleep(100);
                }

                if (response == null)
                {
                    response = new FormStepResult(formStep.Id, false, new string[] { "Timeout na operação de criação do passo" });
                }
                return response;
            }
        }

        
    }
}