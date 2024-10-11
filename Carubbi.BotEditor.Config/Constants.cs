using System;

namespace Carubbi.BotEditor.Config
{
    public static class Constants
    {
        public const string CONTACT_NAME = "ContactName";
        public const string START_MESSAGE = "StartMessage";
        public const string DATA_SOURCE = "DataSource";
        public const string CHANNEL_ID = "ChannelId";
        public const string STATE_BOTFRAMEWORK_URI = "state.botframework.com";
        public const string TOKEN_BOTFRAMEWORK_URI = "token.botframework.com";
        public const string API_BOTFRAMEWORK_URI = "api.botframework.com";
        public const string BOT_ROUTE_TEMPLATE = "bot/{botId}";
        public const string DEFAULT_BOT_ID = "00000000-0000-0000-0000-000000000000";
        public const string PRECONDITION_FAILED_EXCEPTION_MESSAGE = "I'm still processing the previous message... could you repeat please?";
        public const string SPOKEN_INTERACTION = "BotEditor_spokenInteraction";
        public const string OUTPUT_PROPERTY_NAME = "Output";
        public const string AT_CHARACTER = "@";
        public const string SEPARATOR_CHARACTER = ",";
        public const string COULD_NOT_LOAD_STEP_MESSAGE = "Step {0} cannot be loaded";
        public const string DEFAULT_RETRY_MESSAGE = "I didn't catch your answer, can you repeat please?";
        public const string DEFAULT_QUESTION_MESSAGE = "You forgot to enter the question for step {0}";
        public const string DEFAULT_YES= "Yes";
        public const string DEFAULT_NO = "No";
        public const string DEFAULT_TOO_MANY_ATTEMPTS_MESSAGE = "Ops! Too many tries. Let's get back to the start and try again.";
        public const string DEFAULT_FAQ_ASK_MESSAGE = "What do you want to know?";
        public const string CALLBACK_PROPERTY = "Callback";
        public const string BUILDFORM_METHOD = "BuildForm";
        public const string RESUME_AFTER_INPUT_METHOD = "ResumeAfterInput";
        public const string CALL_METHOD = "Call";
        public const string ENTITY_PRIVATE_CONVERSATION_DATA_KEY_PATTERN = "Entity|{0}|{1}";
        public const string DEFAULT_IMAGE_CLASSIFICATION_ASK_IMAGE_MESSAGE = "Send me a picture to analyze";
        public const string DEFAULT_IMAGE_CLASSIFICATION_RETRY_MESSAGE = "I couldn't get your picture, could you send it again please?";
        public const string DEFAULT_LIST_PROMPT_MESSAGE = "Select an option";
        public const string MAP_SELECT_BUTTON_TEXT = "Select";
        public const string DEFAULT_MESSAGE = "You forgot to set the message for step {0}";
        public const string COULD_NOT_LOAD_ROOT_STEP_MESSAGE = "Couldn't get the root step, check if you have duplicated or missing step ids in your config file";
        public const string NOT_SUPPORTED_DIALOG_MESSAGE = "The dialog of type {0} is not supported";
        public const string DEFAULT_VOICE_NAME = "pt-BR-HeloisaRUS";
        public const string DEFAULT_READ_GPS_MESSAGE = "Now share your location with me";
        public const string DEFAULT_READ_GPS_RETRY_MESSAGE = "I couldn't get your location, could you send me again please?";
       
    }
}
