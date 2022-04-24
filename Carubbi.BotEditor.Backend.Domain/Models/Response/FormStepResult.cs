namespace Carubbi.BotEditor.Backend.Domain.Models.Response
{
    public class FormStepResult
    {
        public FormStepResult(int stepId, bool success, string[] errorMessages)
        {
            StepId = stepId;
            Success = success;
            ErrorMessages = errorMessages;
        }

        public int StepId { get; set; }

        public bool Success { get; set; }

        public string[] ErrorMessages { get; set; }
    }
}