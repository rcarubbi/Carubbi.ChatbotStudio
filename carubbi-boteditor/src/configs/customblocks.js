import * as Blockly from 'blockly/core';


const jsonBotDefinitionBlocks = [
  {
    "type": "botconfig",
    "message0": "%1 %2 Steps %3 Commands %4 Voice %5 Credentials %6 Persistence %7 WhatsApp %8 Telegram %9",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "Name",
        "text": "Name"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "Steps",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      },
      {
        "type": "input_statement",
        "name": "CustomCommands",
        "check": "CustomCommandConfig"
      },
      {
        "type": "input_value",
        "name": "SpeechSettings",
        "check": "SpeechSettings"
      },
      {
        "type": "input_value",
        "name": "AppCredentials",
        "check": "AppCredentials"
      },
      {
        "type": "input_value",
        "name": "StoreSettings",
        "check": "StoreSettings"
      },
      {
        "type": "input_value",
        "name": "Whatsapp",
        "check": "WhatsAppChannel"
      },
      {
        "type": "input_value",
        "name": "Telegram",
        "check": "TelegramChannel"
      }
    ],
    "inputsInline": false,
    "colour": 240,
    "tooltip": "Bot Structure",
    "helpUrl": ""
  },
  {
    "type": "messagestep",
    "message0": "%1 Message %2",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_value",
        "name": "Messages",
        "check": "MessageInteractions",
        "align": "CENTRE"
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 90,
    "tooltip": "Message Step",
    "helpUrl": ""
  },
  {
    "type": "inputstep",
    "message0": "%1 Question %2 Durable? %3 %4 Natural Language %5 Text Analysis %6",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_value",
        "name": "Question",
        "check": "MessageInteractions",
        "align": "CENTRE"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "NLPSettings",
        "check": "NlpSettings"
      },
      {
        "type": "input_value",
        "name": "TextAnalysisSettings",
        "check": "TextAnalysisSettings"
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 180,
    "tooltip": "Open question step",
    "helpUrl": ""
  },
  {
    "type": "string",
    "message0": "\" %1 \"",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "Value",
        "text": "Text"
      }
    ],
    "previousStatement": "String",
    "nextStatement": "String",
    "colour": 135,
    "tooltip": "Text",
    "helpUrl": ""
  },
  {
    "type": "nlpsettings",
    "message0": "Natural Language %1 %2 %3 Models %4",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "NlpServiceType",
        "options": [
          [
            "Service Type",
            "None"
          ],
          [
            "Luis",
            "Luis"
          ],
          [
            "Watson",
            "Watson"
          ],
          [
            "DialogFlow",
            "DialogFlow"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "Models",
        "check": "NlpModel"
      }
    ],
    "output": "NlpSettings",
    "colour": 225,
    "tooltip": "NLP Settings",
    "helpUrl": ""
  },
  {
    "type": "textanalysissettings",
    "lastDummyAlign0": "RIGHT",
    "message0": "Text Analysis %1 %2 %3 %4 %5 Key %6 %7 URL %8",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "TextAnalysisServiceType",
        "options": [
          [
            "Service Type",
            "None"
          ],
          [
            "Bing Text",
            "MicrosoftTextAnalysis"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_dropdown",
        "name": "Language",
        "options": [
          [
            "Language",
            "None"
          ],
          [
            "Portuguese",
            "pt-BR"
          ],
          [
            "English",
            "en-US"
          ],
          [
            "Spanish",
            "es-ES"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "SubscriptionKey",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "Endpoint",
        "text": "http://"
      }
    ],
    "output": "TextAnalysisSettings",
    "colour": 315,
    "tooltip": "Text Analysis Settings",
    "helpUrl": ""
  },
  {
    "type": "nlpmodel",
    "message0": "NLP Model %1 App Id %2 %3 Prediction Key %4 %5 Prediction Endpoint %6",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "AppId",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "PredictionKey",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "PredictionEndpoint",
        "text": ""
      }
    ],
    "previousStatement": "NlpModel",
    "nextStatement": "NlpModel",
    "colour": 30,
    "tooltip": "NLP Model",
    "helpUrl": ""
  },
  {
    "type": "confirmstep",
    "message0": "%1 Confirm %2 Question %3 Retry Message %4 Too Many Attempts Message %5 Durable? %6 %7 \"Yes\" Text %8 %9 \"No\" Text %10 %11 \"Yes\" Accepted Answers %12 \"No\" Accepted Answers %13 Attempts %14 %15 Step to \"Yes\" %16 Step to \"No\" %17",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "Question",
        "check": "MessageInteractions"
      },
      {
        "type": "input_value",
        "name": "RetryMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "input_value",
        "name": "TooManyAttemptsMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "YesText",
        "text": "Yes"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "NoText",
        "text": "No"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "YesAcceptedAnswers",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "NoAcceptedAnswers",
        "check": "String"
      },
      {
        "type": "field_number",
        "name": "Attempts",
        "value": 3,
        "min": 1
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "TrueStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      },
      {
        "type": "input_statement",
        "name": "FalseStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 270,
    "tooltip": "Confirm Step",
    "helpUrl": ""
  },
  {
    "type": "messageinteractions",
    "message0": "Interactions %1 Typed %2 Spoken %3 Files %4",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "Typed",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "Spoken",
        "check": "String"
      },
      {
        "type": "input_statement",
        "name": "Files",
        "check": "File"
      }
    ],
    "output": "MessageInteractions",
    "colour": 120,
    "tooltip": "Message Interactions",
    "helpUrl": ""
  },
  {
    "type": "liststep",
    "message0": "%1 List of %2 %3 Prompt Message %4 Itens %5 Retry Message %6 Too Many Attempts Message %7 Durable? %8 %9 Attempts %10 %11 NLP Settings %12 Data Source %13",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "field_dropdown",
        "name": "ListType",
        "options": [
          [
            "Images",
            "ImageList"
          ],
          [
            "Buttons",
            "ButtonList"
          ],
          [
            "Image Buttons",
            "ImageButtonList"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "PromptMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "input_statement",
        "name": "Input",
        "check": "ListItem"
      },
      {
        "type": "input_value",
        "name": "RetryMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "input_value",
        "name": "TooManyAttemptsMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "Attempts",
        "value": 3,
        "min": 1
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "NLPSettings",
        "check": "NlpSettings"
      },
      {
        "type": "input_value",
        "name": "DataSource",
        "check": "DataSource"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 45,
    "tooltip": "List Step",
    "helpUrl": ""
  },
  {
    "type": "customcommandconfig",
    "message0": "Command %1 %2 Start %3 %4 Restart %5 %6 Delete user profile %7 %8 Clear cache %9 %10 Answer %11",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "CommandText",
        "text": "/command"
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_checkbox",
        "name": "Startup",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "ClearDialogStack",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "DeleteProfile",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "InvalidateCache",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "CustomMessageReply",
        "text": "Command executed"
      }
    ],
    "previousStatement": "CustomCommandConfig",
    "nextStatement": "CustomCommandConfig",
    "colour": 0,
    "tooltip": "Help command",
    "helpUrl": ""
  },
  {
    "type": "speechsettings",
    "message0": "STT Voice %1 %2 STT %3 %4 STT Region %5 %6 STT Key %7 %8 TTS Voice %9 %10 TTS %11 %12 TTS Region %13 %14 TTS Key %15 %16 %17 %18 %19",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "Language",
        "options": [
          [
            "Language",
            "None"
          ],
          [
            "Portuguese",
            "pt-BR"
          ],
          [
            "English",
            "en-US"
          ],
          [
            "Spanish",
            "es-ES"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "RecognitionServiceType",
        "options": [
          [
            "Microsoft Speech",
            "BingSpeech"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "RecognitionServiceRegion",
        "options": [
          [
            "Brazil South",
            "brazilsouth"
          ],
          [
            "East US",
            "eastus"
          ],
          [
            "East US 2",
            "eastus2"
          ],
          [
            "South Central us",
            "southcentralus"
          ],
          [
            "West US",
            "westus"
          ],
          [
            "West US 2",
            "westus2"
          ],
          [
            "Central US",
            "centralus"
          ],
          [
            "North Central US",
            "northcentralus"
          ],
          [
            "North Europe",
            "northeurope"
          ],
          [
            "South UK",
            "southuk"
          ],
          [
            "West Europe",
            "westeurope"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "RecognitionSubscriptionKey",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "VoiceName",
        "text": "pt-BR-HeloisaRUS"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "SynthesisServiceType",
        "options": [
          [
            "Microsoft Speech",
            "BingSpeech"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "SynthesisServiceRegion",
        "options": [
          [
            "Brazil South",
            "brazilsouth"
          ],
          [
            "East US",
            "eastus"
          ],
          [
            "East US 2",
            "eastus2"
          ],
          [
            "South Central us",
            "southcentralus"
          ],
          [
            "West US",
            "westus"
          ],
          [
            "West US 2",
            "westus2"
          ],
          [
            "Central US",
            "centralus"
          ],
          [
            "North Central US",
            "northcentralus"
          ],
          [
            "North Europe",
            "northeurope"
          ],
          [
            "South UK",
            "southuk"
          ],
          [
            "West Europe",
            "westeurope"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "SynthesisSubscriptionKey",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "CacheType",
        "options": [
          [
            "Cache Type",
            "None"
          ],
          [
            "In-memory",
            "InMemory"
          ],
          [
            "Redis",
            "Redis"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "StoreType",
        "options": [
          [
            "Storage type",
            "None"
          ],
          [
            "File System",
            "FileSystem"
          ],
          [
            "Azure Blob Storage",
            "AzureBlobStorage"
          ]
        ]
      }
    ],
    "output": "SpeechSettings",
    "colour": 45,
    "tooltip": "Speech Settings",
    "helpUrl": ""
  },
  {
    "type": "appcredentials",
    "message0": "Credentials %1 App Id %2 %3 App Password %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "AppId",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "AppPassword",
        "text": ""
      }
    ],
    "output": "AppCredentials",
    "colour": 165,
    "tooltip": "Microsoft Bot Framework Api Credentials",
    "helpUrl": ""
  },
  {
    "type": "storesettings",
    "message0": "Persistence %1 Store in %2 %3 Connection String %4",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "PersistenceStrategy",
        "options": [
          [
            "In-memory",
            "InMemory"
          ],
          [
            "SQL Server",
            "SqlServer"
          ],
          [
            "Azure Tables",
            "AzureTables"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ConnectionString",
        "text": ""
      }
    ],
    "output": "StoreSettings",
    "colour": 300,
    "tooltip": "Logging and state storage settings (In-memory only state)",
    "helpUrl": ""
  },
  {
    "type": "formstep",
    "message0": "%1 Form %2 Fields %3 Confirmation %4 Durable? %5 %6 Literals %7 Commands %8 Natural Language %9",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "FormFields",
        "check": "FormField"
      },
      {
        "type": "input_value",
        "name": "Summary",
        "check": "Summary"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "FormCustomMessages",
        "check": "FormCustomMessage"
      },
      {
        "type": "input_statement",
        "name": "FormCustomCommands",
        "check": "FormCustomCommand"
      },
      {
        "type": "input_value",
        "name": "NlpSettings",
        "check": "NlpSettings"
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 160,
    "tooltip": "Form step",
    "helpUrl": ""
  },
  {
    "type": "formfield",
    "message0": "Field %1 %2 %3 %4 Optional? %5 %6 %7 %8 NLP Entity %9 %10 Validation API %11 %12 Validation failed message %13 %14 Activation API %15",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_autocomplete",
        "name": "Name",
        "text": "Name"
      },
      {
        "type": "field_autocomplete",
        "name": "Question",
        "text": "Text"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "Optional",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "Type",
        "options": [
          [
            "Type",
            "None"
          ],
          [
            "Number",
            "Number"
          ],
          [
            "Text",
            "Text"
          ],
          [
            "Date",
            "Date"
          ],
          [
            "Time",
            "Time"
          ],
          [
            "Decimal",
            "Decimal"
          ],
          [
            "Yes/No",
            "YesNo"
          ],
          [
            "Brazilian CPF",
            "Brazilian CPF"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "NlpEntityName",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ValidationApiURL",
        "text": "http://"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ValidationFailedMessage",
        "text": "Invalid answer"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ActiveApiURL",
        "text": "http://"
      }
    ],
    "previousStatement": [
      "FormField",
      "OptionsFormField",
      "RestoreFormField"
    ],
    "nextStatement": [
      "FormField",
      "OptionsFormField",
      "RestoreFormField"
    ],
    "colour": 260,
    "tooltip": "Simple form step field",
    "helpUrl": ""
  },
  {
    "type": "optionsformfield",
    "message0": "Options Field %1 %2 %3 %4 Optional? %5 %6 %7 %8 Options %9 NLP Entity %10 %11 Validation Api %12 %13 Validation failed message %14 %15 Activation Api %16",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_autocomplete",
        "name": "Name",
        "text": "Name"
      },
      {
        "type": "field_autocomplete",
        "name": "Question",
        "text": "Text"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "Optional",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_dropdown",
        "name": "Type",
        "options": [
          [
            "Type",
            "None"
          ],
          [
            "Single Option",
            "SingleOption"
          ],
          [
            "Multiple options",
            "ManyOptions"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "Options",
        "check": [
          "FieldOption",
          "FieldOptionSource"
        ]
      },
      {
        "type": "field_autocomplete",
        "name": "NlpEntityName",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ValidationApiURL",
        "text": "http://"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ValidationFailedMessage",
        "text": "Invalid answer"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ActiveApiURL",
        "text": "http://"
      }
    ],
    "previousStatement": [
      "FormField",
      "OptionsFormField",
      "RestoreFormField"
    ],
    "nextStatement": [
      "FormField",
      "OptionsFormField",
      "RestoreFormField"
    ],
    "colour": 290,
    "tooltip": "Options field (Single or multiple)",
    "helpUrl": ""
  },
  {
    "type": "fieldoption",
    "message0": "Option: %1 - %2",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "Value",
        "text": "Value"
      },
      {
        "type": "field_autocomplete",
        "name": "Description",
        "text": "Description"
      }
    ],
    "previousStatement": "FieldOption",
    "nextStatement": "FieldOption",
    "colour": 230,
    "tooltip": "Option for Option field",
    "helpUrl": ""
  },
  {
    "type": "fieldoptionsource",
    "message0": "Api - Options %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "OptionsSource",
        "text": "http://"
      }
    ],
    "previousStatement": "FieldOptionSource",
    "colour": 230,
    "tooltip": "Field Option Source",
    "helpUrl": ""
  },
  {
    "type": "restoreformfield",
    "message0": "Reuse answers %1 %2 %3 %4 bounded questions %5",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_autocomplete",
        "name": "Name",
        "text": "Name"
      },
      {
        "type": "field_autocomplete",
        "name": "Question",
        "text": "Text"
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "RestoreFields",
        "check": "String"
      }
    ],
    "previousStatement": [
      "FormField",
      "OptionsFormField",
      "RestoreFormField"
    ],
    "nextStatement": [
      "FormField",
      "OptionsFormField",
      "RestoreFormField"
    ],
    "colour": 260,
    "tooltip": "Reuse previous answers field",
    "helpUrl": ""
  },
  {
    "type": "summary",
    "message0": "Confirmation %1 %2 Answers list %3 %4 Buttons %5",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "SummaryText",
        "text": "Text"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "IncludeFieldListOnSummary",
        "checked": true
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "IncludeConfirmationButtonsOnSummary",
        "checked": true
      }
    ],
    "output": "Summary",
    "colour": 90,
    "tooltip": "Form summary",
    "helpUrl": ""
  },
  {
    "type": "formcustommessage",
    "message0": "Literal customization %1 %2",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "Key",
        "options": [
          [
            "Yes",
            "Yes"
          ],
          [
            "No",
            "No"
          ],
          [
            "No Preference Message",
            "NoPreferenceMessage"
          ],
          [
            "Choice Last Separator",
            "ChoiceLastSeparator"
          ],
          [
            "Last Separator",
            "LastSeparator"
          ],
          [
            "Navigation Field Name",
            "NavigationFieldName"
          ],
          [
            "Current Choice Message",
            "CurrentChoiceMessage"
          ],
          [
            "Yes/No questions help message",
            "BoolHelpMessage"
          ],
          [
            "Yes/No questions text",
            "BoolMessage"
          ],
          [
            "Clarify Message",
            "ClarifyMessage"
          ],
          [
            "Confirmation Message",
            "ConfirmationMessage"
          ],
          [
            "Current Choice",
            "CurrentChoice"
          ],
          [
            "Date Time Message",
            "DateTimeMessage"
          ],
          [
            "Date Time Help Message",
            "DateTimeHelpMessage"
          ],
          [
            "Decimal type question text",
            "DoubleMessage"
          ],
          [
            "Decimal type question help text",
            "DoubleHelpMessage"
          ],
          [
            "Many Number Help Message",
            "EnumManyNumberHelpMessage"
          ],
          [
            "Many Word Help Message",
            "EnumManyWordHelpMessage"
          ],
          [
            "One Number Help Message",
            "EnumOneNumberHelpMessage"
          ],
          [
            "One Word Help Message",
            "EnumOneWordHelpMessage"
          ],
          [
            "Select Many Message",
            "EnumSelectManyMessage"
          ],
          [
            "Select One Message",
            "EnumSelectOneMessage"
          ],
          [
            "Feed Back Message",
            "FeedBackMessage"
          ],
          [
            "Help Message",
            "HelpMessage"
          ],
          [
            "Help Clarify Message",
            "HelpClarifyMessage"
          ],
          [
            "Help Confirm Message",
            "HelpConfirmMessage"
          ],
          [
            "Help Navigation Message",
            "HelpNavigationMessage"
          ],
          [
            "Integer Message",
            "IntegerMessage"
          ],
          [
            "Integer Help Message",
            "IntegerHelpMessage"
          ],
          [
            "Navigation Message",
            "NavigationMessage"
          ],
          [
            "Navigation Format Message",
            "NavigationFormatMessage"
          ],
          [
            "Navigation Help Message",
            "NavigationHelpMessage"
          ],
          [
            "No Preference Message",
            "NoPreferenceMessage"
          ],
          [
            "Not Understood Message",
            "NotUnderstoodMessage"
          ],
          [
            "Status Format Message",
            "StatusFormatMessage"
          ],
          [
            "Text Message",
            "StringMessage"
          ],
          [
            "Text Help Message",
            "StringHelpMessage"
          ],
          [
            "Unspecified Message",
            "UnspecifiedMessage"
          ]
        ]
      },
      {
        "type": "field_autocomplete",
        "name": "Value",
        "text": "Value"
      }
    ],
    "previousStatement": "FormCustomMessage",
    "nextStatement": "FormCustomMessage",
    "colour": 230,
    "tooltip": "Literal customization",
    "helpUrl": ""
  },
  {
    "type": "formcustomcommand",
    "message0": "Command customization %1 %2 Name %3 Text %4 %5 Help Message %6",
    "args0": [
      {
        "type": "field_dropdown",
        "name": "CommandType",
        "options": [
          [
            "Help",
            "Help"
          ],
          [
            "Back",
            "Backup"
          ],
          [
            "Restart",
            "Reset"
          ],
          [
            "Quit",
            "Quit"
          ],
          [
            "Status",
            "Status"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Description",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Terms",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "HelpMessage",
        "text": ""
      }
    ],
    "previousStatement": "FormCustomCommand",
    "nextStatement": "FormCustomCommand",
    "colour": 135,
    "tooltip": "Command customization",
    "helpUrl": ""
  },
  {
    "type": "datasource",
    "lastDummyAlign0": "RIGHT",
    "message0": "Data source %1 step %2 . %3",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_number",
        "name": "StepId",
        "value": 0,
        "min": 1
      },
      {
        "type": "field_autocomplete",
        "name": "Expression",
        "text": "Expression"
      }
    ],
    "output": "DataSource",
    "colour": 285,
    "tooltip": "Data source",
    "helpUrl": ""
  },
  {
    "type": "conditionstep",
    "message0": "%1 If %2 then %3 else %4 data source %5",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_value",
        "name": "ConditionExpression",
        "check": [
          "RelationalExpression",
          "BinaryLogicalExpression",
          "UnaryLogicalExpression"
        ],
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "TrueStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      },
      {
        "type": "input_statement",
        "name": "FalseStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ],
        "align": "RIGHT"
      },
      {
        "type": "input_value",
        "name": "DataSource",
        "check": "DataSource",
        "align": "RIGHT"
      }
    ],
    "previousStatement": "ConditionStep",
    "colour": 240,
    "tooltip": "Condition step",
    "helpUrl": ""
  },
  {
    "type": "relationalexpression",
    "message0": "%1 %2 %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "Left",
        "check": [
          "Literal",
          "StepExpression"
        ]
      },
      {
        "type": "field_dropdown",
        "name": "Operator",
        "options": [
          [
            "=",
            "Equals"
          ],
          [
            ">",
            "Greater"
          ],
          [
            "<",
            "Less"
          ],
          [
            "≥",
            "GreaterOrEquals"
          ],
          [
            "≤",
            "LessOrEquals"
          ],
          [
            "≠",
            "NotEquals"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "Right",
        "check": [
          "Literal",
          "StepExpression"
        ]
      }
    ],
    "inputsInline": true,
    "output": "RelationalExpression",
    "colour": 240,
    "tooltip": "Relational expression",
    "helpUrl": ""
  },
  {
    "type": "binarylogicalexpression",
    "message0": "%1 %2 %3 %4",
    "args0": [
      {
        "type": "input_value",
        "name": "Left",
        "check": [
          "UnaryLogicalExpression",
          "BinaryLogicalExpression",
          "RelationalExpression"
        ]
      },
      {
        "type": "field_dropdown",
        "name": "Operator",
        "options": [
          [
            "and",
            "And"
          ],
          [
            "or",
            "Or"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "Right",
        "check": [
          "UnaryLogicalExpression",
          "BinaryLogicalExpression",
          "RelationalExpression"
        ]
      }
    ],
    "inputsInline": true,
    "output": null,
    "colour": 75,
    "tooltip": "Binary logical expression",
    "helpUrl": ""
  },
  {
    "type": "unarylogicalexpression",
    "message0": "Not %1",
    "args0": [
      {
        "type": "input_value",
        "name": "Left",
        "check": [
          "BinaryLogicalExpression",
          "UnaryLogicalExpression",
          "RelationalExpression"
        ]
      }
    ],
    "inputsInline": true,
    "output": "UnaryLogicalExpression",
    "colour": 0,
    "tooltip": "Unary logical operator \"Not\"",
    "helpUrl": ""
  },
  {
    "type": "stepexpression",
    "lastDummyAlign0": "RIGHT",
    "message0": "@ %1 . %2",
    "args0": [
      {
        "type": "field_number",
        "name": "StepId",
        "value": 0,
        "min": 1
      },
      {
        "type": "field_autocomplete",
        "name": "Expression",
        "text": "Expression"
      }
    ],
    "output": "StepExpression",
    "colour": 285,
    "tooltip": "Expression to get step data",
    "helpUrl": ""
  },
  {
    "type": "literal",
    "message0": "%1",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "Value",
        "text": "Literal"
      }
    ],
    "inputsInline": true,
    "output": "Literal",
    "colour": 180,
    "tooltip": "Literal Value",
    "helpUrl": ""
  },
  {
    "type": "navigatelistitem",
    "message0": "Navigate to step %1 Title %2 %3 Sub-Title %4 %5 Image Url %6 %7 Button title %8 %9 Button value %10 %11 Steps %12",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Title",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "SubTitle",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ImageUrl",
        "text": "http://"
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ButtonTitle",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ButtonValue",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "TargetStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      }
    ],
    "previousStatement": "ListItem",
    "nextStatement": "ListItem",
    "colour": 300,
    "tooltip": "List item to navigate to child steps",
    "helpUrl": ""
  },
  {
    "type": "openurllistitem",
    "lastDummyAlign0": "RIGHT",
    "message0": "Open webpage %1 Title %2 %3 Sub-title %4 %5 Image Url %6 %7 Button title %8 %9 Navigate to %10",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Title",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "SubTitle",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ImageUrl",
        "text": "http://"
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ButtonTitle",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ButtonValue",
        "text": "http://"
      }
    ],
    "previousStatement": "ListItem",
    "nextStatement": "ListItem",
    "colour": 345,
    "tooltip": "List item to open url",
    "helpUrl": ""
  },
  {
    "type": "downloadfilelistitem",
    "lastDummyAlign0": "RIGHT",
    "message0": "Download file %1 Title %2 %3 Sub-title %4 %5 Image url %6 %7 Button title %8 %9 File link %10",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Title",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "SubTitle",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ImageUrl",
        "text": "http://"
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ButtonTitle",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ButtonValue",
        "text": "http://"
      }
    ],
    "previousStatement": "ListItem",
    "nextStatement": "ListItem",
    "colour": 75,
    "tooltip": "Download file list item",
    "helpUrl": ""
  },
  {
    "type": "apistep",
    "message0": "%1 API %2 Method %3 %4 Url %5 %6 Resource %7 %8 Parameters %9 Durable? %10 %11 Data source %12 Loading message %13",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "Verb",
        "options": [
          [
            "Get",
            "Get"
          ],
          [
            "Post",
            "Post"
          ],
          [
            "Put",
            "Put"
          ],
          [
            "Delete",
            "Delete"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ApiURL",
        "text": "http://"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Resource",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "Parameters",
        "check": "ApiParameter"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "DataSource",
        "check": "DataSource"
      },
      {
        "type": "input_value",
        "name": "LoadingMessage",
        "check": "MessageInteractions"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 90,
    "tooltip": "External API call step",
    "helpUrl": ""
  },
  {
    "type": "apiparameter",
    "lastDummyAlign0": "RIGHT",
    "message0": "Parameter %1 Name %2 Valor %3 %4 Type %5",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_autocomplete",
        "name": "Name",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Value",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_dropdown",
        "name": "Type",
        "options": [
          [
            "Default",
            "Default"
          ],
          [
            "URL Segment",
            "UrlSegment"
          ],
          [
            "Query string",
            "QueryString"
          ],
          [
            "Header HTTP",
            "Header"
          ],
          [
            "File",
            "File"
          ],
          [
            "JSON Object",
            "JsonObject"
          ]
        ]
      }
    ],
    "previousStatement": "ApiParameter",
    "nextStatement": "ApiParameter",
    "colour": 60,
    "tooltip": "API Parameter",
    "helpUrl": ""
  },
  {
    "type": "goto",
    "lastDummyAlign0": "CENTRE",
    "message0": "Go to Step %1",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "Id",
        "text": ""
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 330,
    "tooltip": "Redirect the flow to another step",
    "helpUrl": ""
  },
  {
    "type": "compositestep",
    "message0": "%1 Composite %2 Name %3 %4 steps %5",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_autocomplete",
        "name": "Name",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "Steps",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 330,
    "tooltip": "Composite step",
    "helpUrl": ""
  },
  {
    "type": "faqstep",
    "message0": "%1 F.A.Q. %2 Message %3 Minimum Score %4 %5 Durable? %6 %7 Settings %8",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "AskQuestionMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "field_number",
        "name": "MinimumScore",
        "value": 0,
        "min": 0,
        "precision": 2
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "FaqSettings",
        "check": "FaqSettings"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 30,
    "tooltip": "FAQ step",
    "helpUrl": ""
  },
  {
    "type": "faqsettings",
    "message0": "FAQ settings %1 %2 %3 Knowledge Base Id %4 %5 Key %6 %7 Url %8 %9 Max answers %10",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "ServiceType",
        "options": [
          [
            "Service Type",
            "None"
          ],
          [
            "QnA Maker",
            "QnAMaker"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "KnowledgeBaseId",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "EndpointKey",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Endpoint",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_number",
        "name": "MaxAnswers",
        "value": 0,
        "min": 0
      }
    ],
    "output": "FaqSettings",
    "colour": 300,
    "tooltip": "FAQ Settings",
    "helpUrl": ""
  },
  {
    "type": "mapsstep",
    "message0": "%1 Maps %2 %3 %4 Api Key %5 %6 Addresses %7 Selectable? %8 %9 Durable? %10 %11 Data source %12",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "ServiceType",
        "options": [
          [
            "Service",
            "None"
          ],
          [
            "Bing Maps",
            "BingMaps"
          ],
          [
            "Google Maps",
            "GoogleMaps"
          ]
        ]
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "ApiKey",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "Input",
        "check": "LocationSource"
      },
      {
        "type": "field_checkbox",
        "name": "Selectable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "DataSource",
        "check": "DataSource"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 120,
    "tooltip": "Maps step",
    "helpUrl": ""
  },
  {
    "type": "locationsource",
    "lastDummyAlign0": "RIGHT",
    "message0": "Address %1 Name %2 %3 Latitude %4 Longitude %5 %6 postcode %7 Street %8 %9 State %10 City %11",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_autocomplete",
        "name": "Name",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "Latitude",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Longitude",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ZipCode",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Address",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "State",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "City",
        "text": ""
      }
    ],
    "previousStatement": "LocationSource",
    "nextStatement": "LocationSource",
    "colour": 60,
    "tooltip": "Location source",
    "helpUrl": ""
  },
  {
    "type": "switchstep",
    "message0": "%1 Switch %2 %3 Cases %4 Data source %5",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Input",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "Cases",
        "check": "Case"
      },
      {
        "type": "input_value",
        "name": "DataSource",
        "check": "DataSource"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 45,
    "tooltip": "Switch-case step",
    "helpUrl": ""
  },
  {
    "type": "case",
    "message0": "Case %1 %2 then %3",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "Value",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "TargetStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      }
    ],
    "previousStatement": "Case",
    "nextStatement": "Case",
    "colour": 30,
    "tooltip": "case",
    "helpUrl": ""
  },
  {
    "type": "imageclassificationstep",
    "message0": "%1 Image classification %2 Question %3 Retry Message %4 Too many tries message %5 Durable? %6 %7 Attempts %8 %9 Results %10 %11 Min score %12 %13 Go to step %14 if error  %15 Configuration %16",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "AskImageMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "input_value",
        "name": "RetryMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "input_value",
        "name": "TooManyAttemptsMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_number",
        "name": "Attempts",
        "value": 3,
        "min": 1
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_number",
        "name": "MaxResults",
        "value": 5,
        "min": 0
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_number",
        "name": "MinScore",
        "value": 0,
        "min": 0,
        "precision": 2
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_number",
        "name": "ErrorStepId",
        "value": 0,
        "min": 0
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_value",
        "name": "ImageClassificationSettings",
        "check": "ImageClassificationSettings"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 270,
    "tooltip": "Image classification step",
    "helpUrl": ""
  },
  {
    "type": "imageclassificationsettings",
    "lastDummyAlign0": "RIGHT",
    "message0": "Image classification settings %1 %2 %3 %4 %5 Prediction %6 %7 %8 Training %9 %10",
    "args0": [
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_dropdown",
        "name": "ServiceType",
        "options": [
          [
            "Service Type",
            "None"
          ],
          [
            "Microsoft Custom Vision",
            "MicrosoftCustomVision"
          ]
        ]
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "ProjectId",
        "text": "Project Id"
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "PredictionEndpoint",
        "text": "Url"
      },
      {
        "type": "field_autocomplete",
        "name": "PredictionKey",
        "text": "Key"
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_autocomplete",
        "name": "TrainingEndpoint",
        "text": "Url"
      },
      {
        "type": "field_autocomplete",
        "name": "TrainingKey",
        "text": "Key"
      }
    ],
    "output": "ImageClassificationSettings",
    "colour": 180,
    "tooltip": "Image Classification Settings",
    "helpUrl": ""
  },
  {
    "type": "readgpslocationstep",
    "lastDummyAlign0": "RIGHT",
    "message0": "%1 GPS Location %2 Question %3 Retry message %4 Too many attempts %5 Durable? %6 %7 Attempts %8 %9 If fails, go to step %10",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_value",
        "name": "AskLocationMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "input_value",
        "name": "RetryMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "input_value",
        "name": "TooManyAttemptsMessage",
        "check": "MessageInteractions"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_number",
        "name": "Attempts",
        "value": 3,
        "min": 1
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "field_number",
        "name": "ErrorStepId",
        "value": 0,
        "min": 0
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 180,
    "tooltip": "GPS Location Step",
    "helpUrl": ""
  },
  {
    "type": "transformation",
    "lastDummyAlign0": "CENTRE",
    "message0": "from %1 to %2",
    "args0": [
      {
        "type": "field_autocomplete",
        "name": "InputExpression",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "OutputExpression",
        "text": ""
      }
    ],
    "previousStatement": "Transformation",
    "nextStatement": "Transformation",
    "colour": 210,
    "tooltip": "Transformation",
    "helpUrl": ""
  },
  {
    "type": "file",
    "message0": "File %1 Name %2 %3 Url %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Filename",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Url",
        "text": "http://"
      }
    ],
    "previousStatement": "File",
    "nextStatement": "File",
    "colour": 290,
    "tooltip": "Download file",
    "helpUrl": ""
  },
  {
    "type": "handoffstep",
    "lastDummyAlign0": "RIGHT",
    "message0": "%1 Hand off to %2 %3 Durable? %4",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "URL",
        "text": "http://"
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "field_checkbox",
        "name": "Durable",
        "checked": false
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 300,
    "tooltip": "Hand off step",
    "helpUrl": ""
  },
  {
    "type": "transformstep",
    "message0": "%1 Transform %2 Source %3 %4 Transformations %5 Data source %6",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "field_autocomplete",
        "name": "PropertyPath",
        "text": ""
      },
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "Input",
        "check": "Transformation"
      },
      {
        "type": "input_value",
        "name": "DataSource",
        "check": "DataSource"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 300,
    "tooltip": "Transformation step",
    "helpUrl": ""
  },
  {
    "type": "simplemessagestep",
    "message0": "%1 Message %2",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Message",
        "text": ""
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 90,
    "tooltip": "Message step",
    "helpUrl": ""
  },
  {
    "type": "simpleinputstep",
    "message0": "%1 Question %2",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Message",
        "text": ""
      }
    ],
    "inputsInline": false,
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "nextStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 180,
    "tooltip": "Simple Question step",
    "helpUrl": ""
  },
  {
    "type": "simpleconfirmstep",
    "message0": "%1 Confirm %2 %3 \"Yes\" Steps %4 \"No\" Steps %5",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Message",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "TrueStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      },
      {
        "type": "input_statement",
        "name": "FalseStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 270,
    "tooltip": "Simple confirmation step",
    "helpUrl": ""
  },
  {
    "type": "simpleliststep",
    "message0": "%1 Button list %2 %3 Items %4",
    "args0": [
      {
        "type": "field_label_serializable",
        "name": "Id",
        "text": ""
      },
      {
        "type": "field_autocomplete",
        "name": "Message",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "CENTRE"
      },
      {
        "type": "input_statement",
        "name": "Input",
        "check": "ListItem"
      }
    ],
    "previousStatement": [
      "ReadGPSLocationStep",
      "MessageStep",
      "ConfirmStep",
      "InputStep",
      "ListStep",
      "FormStep",
      "ConditionStep",
      "SwitchStep",
      "TransformStep",
      "CompositeStep",
      "ImageClassificationStep",
      "MapsStep",
      "FaqStep",
      "ApiStep",
      "GoTo",
      "HandoffStep",
      "SimpleMessageStep",
      "SimpleInputStep",
      "SimpleConfirmStep",
      "SimpleListStep"
    ],
    "colour": 45,
    "tooltip": "List step",
    "helpUrl": ""
  },
  {
    "type": "simplelistitem",
    "message0": "Navigate to step %1 Title %2 %3 Steps %4",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "Title",
        "text": ""
      },
      {
        "type": "input_dummy",
        "align": "RIGHT"
      },
      {
        "type": "input_statement",
        "name": "TargetStep",
        "check": [
          "ReadGPSLocationStep",
          "MessageStep",
          "ConfirmStep",
          "InputStep",
          "ListStep",
          "FormStep",
          "ConditionStep",
          "SwitchStep",
          "TransformStep",
          "CompositeStep",
          "ImageClassificationStep",
          "MapsStep",
          "FaqStep",
          "ApiStep",
          "GoTo",
          "HandoffStep",
          "SimpleMessageStep",
          "SimpleInputStep",
          "SimpleConfirmStep",
          "SimpleListStep"
        ]
      }
    ],
    "previousStatement": "ListItem",
    "nextStatement": "ListItem",
    "colour": 300,
    "tooltip": "List item to navigate to child steps",
    "helpUrl": ""
  },
  {
    "type": "telegramchannel",
    "message0": "Telegram %1 Token %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "field_autocomplete",
        "name": "TelegramToken",
        "text": "Token"
      }
    ],
    "output": "TelegramChannel",
    "colour": 225,
    "tooltip": "Telegram channel setings",
    "helpUrl": ""
  },
  {
    "type": "whatsappchannel",
    "message0": "WhatsApp %1 Phones %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "phoneNumbers",
        "check": "String"
      }
    ],
    "output": "WhatsAppChannel",
    "colour": 120,
    "tooltip": "WhatsApp channel settings",
    "helpUrl": ""
  }];

jsonBotDefinitionBlocks.map((item) => {

  Blockly.Blocks[item.type] = {
    init: function () {
      this.jsonInit(item);
      if (item.type === 'botconfig') this.setDeletable(false);
    }
  };
  return null;
});
