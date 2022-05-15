import * as Blockly from 'blockly/core';

const jsonBotDefinitionBlocks = [{
  "type": "botconfig",
  "message0": "%1 %2 Passos %3 Comandos %4 Voz %5 Credenciais %6 Persistência %7",
  "args0": [
    {
      "type": "field_input",
      "name": "Name",
      "text": "Nome"
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
    }
  ],
  "inputsInline": false,
  "colour": 240,
  "tooltip": "Estrutura do bot",
  "helpUrl": ""
},
{
  "type": "messagestep",
  "message0": "%1 Mensagem %2",
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
  "tooltip": "Passo de mensagem",
  "helpUrl": ""
},
{
  "type": "inputstep",
  "message0": "%1 Pergunta %2 Durável? %3 %4 Linguagem Natural %5 Análise de Texto %6",
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
  "tooltip": "Passo de pergunta aberta",
  "helpUrl": ""
},
{
  "type": "string",
  "message0": "\" %1 \"",
  "args0": [
    {
      "type": "field_input",
      "name": "Value",
      "text": "Texto"
    }
  ],
  "previousStatement": "String",
  "nextStatement": "String",
  "colour": 135,
  "tooltip": "Texto",
  "helpUrl": ""
},
{
  "type": "nlpsettings",
  "message0": "Linguagem natural %1 %2 %3 Modelos %4",
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
          "Tipo de serviço",
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
  "tooltip": "Configurações de NLP",
  "helpUrl": ""
},
{
  "type": "textanalysissettings",
  "lastDummyAlign0": "RIGHT",
  "message0": "Análise de texto %1 %2 %3 %4 %5 Chave %6 %7 URL %8",
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
          "Tipo de Serviço",
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
          "Idioma",
          "None"
        ],
        [
          "Português",
          "pt-BR"
        ],
        [
          "Inglês",
          "en-US"
        ],
        [
          "Espanhol",
          "es-ES"
        ]
      ]
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "SubscriptionKey",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "Endpoint",
      "text": "http://"
    }
  ],
  "output": "TextAnalysisSettings",
  "colour": 315,
  "tooltip": "Configurações de análise de texto",
  "helpUrl": ""
},
{
  "type": "nlpmodel",
  "message0": "Modelo NLP %1 App Id %2 %3 Prediction Key %4 %5 Prediction Endpoint %6",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "AppId",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "PredictionKey",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "PredictionEndpoint",
      "text": ""
    }
  ],
  "previousStatement": "NlpModel",
  "nextStatement": "NlpModel",
  "colour": 30,
  "tooltip": "Modelo de NLP",
  "helpUrl": ""
},
{
  "type": "confirmstep",
  "message0": "%1 Confirmação %2 Pergunta %3 Retentativas %4 Muitas tentativas %5 Durável? %6 %7 Botão \"Sim\" %8 %9 Botão \"Não\" %10 %11 Respostas para \"Sim\" %12 Respostas para \"Não\" %13 Tentativas %14 %15 Passos para \"Sim\" %16 Passos para \"Não\" %17",
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
      "type": "field_input",
      "name": "YesText",
      "text": "Sim"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "NoText",
      "text": "Não"
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
  "tooltip": "Passo de confirmação",
  "helpUrl": ""
},
{
  "type": "messageinteractions",
  "message0": "Interações %1 Texto %2 Voz %3 Arquivos %4",
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
  "tooltip": "Mensagens de Interações",
  "helpUrl": ""
},
{
  "type": "liststep",
  "message0": "%1 Lista de %2 %3 Texto %4 Itens %5 Retentativas %6 Muitas tentativas %7 Durável? %8 %9 Tentativas %10 %11 Linguagem Natural %12 Fonte de dados %13",
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
          "Imagens",
          "ImageList"
        ],
        [
          "Botões",
          "ButtonList"
        ],
        [
          "Imagens com botões",
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
  "tooltip": "Passo de lista",
  "helpUrl": ""
},
{
  "type": "customcommandconfig",
  "message0": "Comando %1 %2 Iniciar %3 %4 Reiniciar %5 %6 Excluir dados do usuário %7 %8 Limpar cache %9 %10 Resposta %11",
  "args0": [
    {
      "type": "field_input",
      "name": "CommandText",
      "text": "/comando"
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
      "type": "field_input",
      "name": "CustomMessageReply",
      "text": "Comando executado"
    }
  ],
  "previousStatement": "CustomCommandConfig",
  "nextStatement": "CustomCommandConfig",
  "colour": 0,
  "tooltip": "Comando de ajuda",
  "helpUrl": ""
},
{
  "type": "speechsettings",
  "message0": "Voz STT %1 %2 STT %3 %4 Região do STT  %5 %6 Chave do STT %7 %8 Voz TTS %9 %10 TTS %11 %12 Região do TTS %13 %14 Chave do TTS %15 %16 %17 %18 %19",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "Language",
      "options": [
        [
          "Idioma",
          "None"
        ],
        [
          "Português",
          "pt-BR"
        ],
        [
          "Inglês",
          "en-US"
        ],
        [
          "Espanhol",
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
          "Sul do Brasil",
          "brazilsouth"
        ],
        [
          "Leste dos EUA",
          "eastus"
        ],
        [
          "Leste dos EUA 2",
          "eastus2"
        ],
        [
          "Centro-sul dos EUA",
          "southcentralus"
        ],
        [
          "Oeste dos EUA",
          "westus"
        ],
        [
          "Oeste dos EUA 2",
          "westus2"
        ],
        [
          "Centro dos EUA",
          "centralus"
        ],
        [
          "Centro-norte dos EUA",
          "northcentralus"
        ],
        [
          "Norte da Europa",
          "northeurope"
        ],
        [
          "Sul do Reino Unido",
          "southuk"
        ],
        [
          "Oeste da Europa",
          "westeurope"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "RecognitionSubscriptionKey",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
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
          "Sul do Brasil",
          "brazilsouth"
        ],
        [
          "Leste dos EUA",
          "eastus"
        ],
        [
          "Leste dos EUA 2",
          "eastus2"
        ],
        [
          "Centro-sul dos EUA",
          "southcentralus"
        ],
        [
          "Oeste dos EUA",
          "westus"
        ],
        [
          "Oeste dos EUA 2",
          "westus2"
        ],
        [
          "Centro dos EUA",
          "centralus"
        ],
        [
          "Centro-norte dos EUA",
          "northcentralus"
        ],
        [
          "Norte da Europa",
          "northeurope"
        ],
        [
          "Sul do Reino Unido",
          "southuk"
        ],
        [
          "Oeste da Europa",
          "westeurope"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
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
          "Tipo de Cache",
          "None"
        ],
        [
          "Em memória",
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
          "Tipo de Armazenamento",
          "None"
        ],
        [
          "Em disco",
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
  "tooltip": "Configurações de Voz",
  "helpUrl": ""
},
{
  "type": "appcredentials",
  "message0": "Credenciais %1 App Id %2 %3 App Password %4",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "AppId",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "AppPassword",
      "text": ""
    }
  ],
  "output": "AppCredentials",
  "colour": 165,
  "tooltip": "Credenciais da API do Microsoft Bot Framework",
  "helpUrl": ""
},
{
  "type": "storesettings",
  "message0": "Persistência %1 Armazenar em %2 %3 String de conexão %4",
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
          "Memória",
          "InMemory"
        ],
        [
          "Banco de dados SQL Server",
          "SqlServer"
        ],
        [
          "Banco de dados Azure Tables",
          "AzureTables"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "ConnectionString",
      "text": ""
    }
  ],
  "output": "StoreSettings",
  "colour": 300,
  "tooltip": "Configurações de Armazenamento de log e estado (Em memória apenas estado)",
  "helpUrl": ""
},
{
  "type": "formstep",
  "message0": "%1 Questionário %2 Perguntas %3 Confirmação %4 Durável? %5 %6 Literais %7 Comandos %8 Linguagem Natural %9",
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
  "tooltip": "Passo de questionário",
  "helpUrl": ""
},
{
  "type": "formfield",
  "message0": "Pergunta %1 %2 %3 %4 Opcional? %5 %6 %7 %8 Entidade NLP %9 %10 Api de Validação %11 %12 Mensagem de falha %13 %14 Api de Ativação %15",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_input",
      "name": "Name",
      "text": "Nome"
    },
    {
      "type": "field_input",
      "name": "Question",
      "text": "Texto"
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
          "Tipo",
          "None"
        ],
        [
          "Número",
          "Number"
        ],
        [
          "Texto",
          "Text"
        ],
        [
          "Data",
          "Date"
        ],
        [
          "Hora",
          "Time"
        ],
        [
          "Decimal",
          "Decimal"
        ],
        [
          "Sim/Não",
          "YesNo"
        ],
        [
          "CPF",
          "CPF"
        ]
      ]
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "NlpEntityName",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "ValidationApiURL",
      "text": "http://"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "ValidationFailedMessage",
      "text": "Resposta Inválida"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
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
  "tooltip": "Pergunta simples para ser utilizada no passo de questionários",
  "helpUrl": ""
},
{
  "type": "optionsformfield",
  "message0": "Pergunta de seleção %1 %2 %3 %4 Opcional? %5 %6 %7 %8 Opções %9 Entidade NLP %10 %11 Api de Validação %12 %13 Mensagem de falha  %14 %15 Api de Ativação %16",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_input",
      "name": "Name",
      "text": "Nome"
    },
    {
      "type": "field_input",
      "name": "Question",
      "text": "Texto"
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
          "Tipo",
          "None"
        ],
        [
          "Escolha Única",
          "SingleOption"
        ],
        [
          "Escolha Múltipla",
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
      "type": "field_input",
      "name": "NlpEntityName",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "ValidationApiURL",
      "text": "http://"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "ValidationFailedMessage",
      "text": "Resposta Inválida"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
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
  "tooltip": "Pergunta de seleção de opções (múltiplas ou única)",
  "helpUrl": ""
},
{
  "type": "fieldoption",
  "message0": "Opção: %1 - %2",
  "args0": [
    {
      "type": "field_input",
      "name": "Value",
      "text": "Valor"
    },
    {
      "type": "field_input",
      "name": "Description",
      "text": "Descrição"
    }
  ],
  "previousStatement": "FieldOption",
  "nextStatement": "FieldOption",
  "colour": 230,
  "tooltip": "Opção para seleção em pergunta de única ou múltipla escolha",
  "helpUrl": ""
},
{
  "type": "fieldoptionsource",
  "message0": "Api - Opções %1 %2",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "OptionsSource",
      "text": "http://"
    }
  ],
  "previousStatement": "FieldOptionSource",
  "colour": 230,
  "tooltip": "Opção para seleção em pergunta de única ou múltipla escolha",
  "helpUrl": ""
},
{
  "type": "restoreformfield",
  "message0": "Reutilização de respostas %1 %2 %3 %4 Perguntas vinculadas %5",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_input",
      "name": "Name",
      "text": "Nome"
    },
    {
      "type": "field_input",
      "name": "Question",
      "text": "Texto"
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
  "tooltip": "Pergunta de reutilização de respostas anteriores",
  "helpUrl": ""
},
{
  "type": "summary",
  "message0": "Confirmação %1 %2 Lista de Respostas %3 %4 Botões %5",
  "args0": [
    {
      "type": "field_input",
      "name": "SummaryText",
      "text": "Texto"
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
  "tooltip": "Sumário de respostas do questionário",
  "helpUrl": ""
},
{
  "type": "formcustommessage",
  "message0": "Customização de Literal %1 %2",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "Key",
      "options": [
        [
          "Sim",
          "Yes"
        ],
        [
          "Não",
          "No"
        ],
        [
          "Resposta vazia em pergunta opcional",
          "NoPreferenceMessage"
        ],
        [
          "utilizada antes da última escolha em listas de única escolha ",
          "ChoiceLastSeparator"
        ],
        [
          "utilizada antes da última escolha em listas de múltipla escolha ",
          "LastSeparator"
        ],
        [
          "para nomear o campo de navegação",
          "NavigationFieldName"
        ],
        [
          "válida para valor atual em listas de única escolha",
          "CurrentChoiceMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo Sim/Não",
          "BoolHelpMessage"
        ],
        [
          "Texto de pergunta do tipo Sim/Não",
          "BoolMessage"
        ],
        [
          "Esclarescer uma escolha ambígua",
          "ClarifyMessage"
        ],
        [
          "Texto de confirmação",
          "ConfirmationMessage"
        ],
        [
          "Texto para exibir escolha atual",
          "CurrentChoice"
        ],
        [
          "Texto de pergunta do tipo Data/Hora",
          "DateTimeMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo Data/Hora",
          "DateTimeHelpMessage"
        ],
        [
          "Texto de pergunta do tipo Decimal",
          "DoubleMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo Decimal",
          "DoubleHelpMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo lista numérica de múltipla seleção",
          "EnumManyNumberHelpMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo lista de palavras de múltipla seleção",
          "EnumManyWordHelpMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo lista numérica de única seleção",
          "EnumOneNumberHelpMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo lista de palavras de única seleção",
          "EnumOneWordHelpMessage"
        ],
        [
          "Texto da pergunta do tipo lista de múltipla seleção",
          "EnumSelectManyMessage"
        ],
        [
          "Texto da pergunta do tipo lista de única seleção",
          "EnumSelectOneMessage"
        ],
        [
          "Mensagem de feedback após resposta do usuário",
          "FeedBackMessage"
        ],
        [
          "Mensagem de ajuda",
          "HelpMessage"
        ],
        [
          "Mensagem de ajuda exibida durante esclarescimento",
          "HelpClarifyMessage"
        ],
        [
          "Mensagem de ajuda exibida durante confirmação",
          "HelpConfirmMessage"
        ],
        [
          "Mensagem de ajuda exibida durante navegação",
          "HelpNavigationMessage"
        ],
        [
          "Texto da pergunta do tipo número",
          "IntegerMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo número",
          "IntegerHelpMessage"
        ],
        [
          "Pergunta de navegação",
          "NavigationMessage"
        ],
        [
          "Formato de navegação",
          "NavigationFormatMessage"
        ],
        [
          "Mensagem de ajuda para navegação",
          "NavigationHelpMessage"
        ],
        [
          "Literal para resposta vazia em perguntas opcionais",
          "NoPreferenceMessage"
        ],
        [
          "Texto para respostas inválidas",
          "NotUnderstoodMessage"
        ],
        [
          "Formato do status",
          "StatusFormatMessage"
        ],
        [
          "Texto da pergunta do tipo texto",
          "StringMessage"
        ],
        [
          "Mensagem de ajuda para perguntas do tipo texto",
          "StringHelpMessage"
        ],
        [
          "Texto para perguntas ainda não respondidas",
          "UnspecifiedMessage"
        ]
      ]
    },
    {
      "type": "field_input",
      "name": "Value",
      "text": "Valor"
    }
  ],
  "previousStatement": "FormCustomMessage",
  "nextStatement": "FormCustomMessage",
  "colour": 230,
  "tooltip": "Customização de Literal",
  "helpUrl": ""
},
{
  "type": "formcustomcommand",
  "message0": "Customização do comando %1 %2 Nome %3 Texto %4 %5 Mensagem de ajuda %6",
  "args0": [
    {
      "type": "field_dropdown",
      "name": "CommandType",
      "options": [
        [
          "Ajuda",
          "Help"
        ],
        [
          "Voltar",
          "Backup"
        ],
        [
          "Reiniciar",
          "Reset"
        ],
        [
          "Sair",
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
      "type": "field_input",
      "name": "Description",
      "text": ""
    },
    {
      "type": "field_input",
      "name": "Terms",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "HelpMessage",
      "text": ""
    }
  ],
  "previousStatement": "FormCustomCommand",
  "nextStatement": "FormCustomCommand",
  "colour": 135,
  "tooltip": "Customização de Comando",
  "helpUrl": ""
},
{
  "type": "datasource",
  "lastDummyAlign0": "RIGHT",
  "message0": "Origem de dados %1 Passo %2 . %3",
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
      "type": "field_input",
      "name": "Expression",
      "text": "Expressão"
    }
  ],
  "output": "DataSource",
  "colour": 285,
  "tooltip": "Origem de dados",
  "helpUrl": ""
},
{
  "type": "conditionstep",
  "message0": "%1 Se %2 Então %3 Senão %4 Fonte de dados %5",
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
  "tooltip": "Passo de condição",
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
  "tooltip": "Expressão relacional",
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
          "e",
          "And"
        ],
        [
          "ou",
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
  "tooltip": "Expressão Lógica binária",
  "helpUrl": ""
},
{
  "type": "unarylogicalexpression",
  "message0": "Não %1",
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
  "tooltip": "Operador Lógico Unário \"Não\"",
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
      "type": "field_input",
      "name": "Expression",
      "text": "Expressão"
    }
  ],
  "output": "StepExpression",
  "colour": 285,
  "tooltip": "Expressão para obter informações de um passo",
  "helpUrl": ""
},
{
  "type": "literal",
  "message0": "%1",
  "args0": [
    {
      "type": "field_input",
      "name": "Value",
      "text": "Literal"
    }
  ],
  "inputsInline": true,
  "output": "Literal",
  "colour": 180,
  "tooltip": "Valor Literal",
  "helpUrl": ""
},
{
  "type": "navigatelistitem",
  "message0": "Navegar para passo %1 Título %2 %3 Sub-Título %4 %5 Url da Imagem %6 %7 Título do Botão %8 %9 Valor do Botão %10 %11 Passos %12",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "Title",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "SubTitle",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ImageUrl",
      "text": "http://"
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ButtonTitle",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
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
  "tooltip": "Item de lista para navegar para passos filhos",
  "helpUrl": ""
},
{
  "type": "openurllistitem",
  "lastDummyAlign0": "RIGHT",
  "message0": "Abrir Página da Web %1 Título %2 %3 Sub-Título %4 %5 Url da Imagem %6 %7 Título do Botão %8 %9 Navegar para %10",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "Title",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "SubTitle",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ImageUrl",
      "text": "http://"
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ButtonTitle",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ButtonValue",
      "text": "http://"
    }
  ],
  "previousStatement": "ListItem",
  "nextStatement": "ListItem",
  "colour": 345,
  "tooltip": "Item de lista para abrir página da web",
  "helpUrl": ""
},
{
  "type": "downloadfilelistitem",
  "lastDummyAlign0": "RIGHT",
  "message0": "Baixar Arquivo %1 Título %2 %3 Sub-Título %4 %5 Url da Imagem %6 %7 Título do Botão %8 %9 Link do arquivo %10",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "Title",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "SubTitle",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ImageUrl",
      "text": "http://"
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ButtonTitle",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ButtonValue",
      "text": "http://"
    }
  ],
  "previousStatement": "ListItem",
  "nextStatement": "ListItem",
  "colour": 75,
  "tooltip": "Item de lista para baixar arquivo",
  "helpUrl": ""
},
{
  "type": "apistep",
  "message0": "%1 API %2 Método %3 %4 Url %5 %6 Recurso %7 %8 Parâmetros %9 Durável? %10 %11 Fonte de dados %12 Mensagem durante o carregamento %13",
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
      "type": "field_input",
      "name": "ApiURL",
      "text": "http://"
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
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
  "tooltip": "Passo de chamada de API externa",
  "helpUrl": ""
},
{
  "type": "apiparameter",
  "lastDummyAlign0": "RIGHT",
  "message0": "Parâmetro %1 Nome %2 Valor %3 %4 Tipo %5",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_input",
      "name": "Name",
      "text": ""
    },
    {
      "type": "field_input",
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
          "Padrão",
          "Default"
        ],
        [
          "Segmento de URL",
          "UrlSegment"
        ],
        [
          "Cabeçalho HTTP",
          "Header"
        ],
        [
          "Arquivo",
          "File"
        ],
        [
          "Objeto JSON",
          "JsonObject"
        ]
      ]
    }
  ],
  "previousStatement": "ApiParameter",
  "nextStatement": "ApiParameter",
  "colour": 60,
  "tooltip": "Parâmetro de API",
  "helpUrl": ""
},
{
  "type": "goto",
  "lastDummyAlign0": "CENTRE",
  "message0": "Ir para o Passo %1",
  "args0": [
    {
      "type": "field_input",
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
  "tooltip": "Redirecionar o fluxo para outro passo",
  "helpUrl": ""
},
{
  "type": "compositestep",
  "message0": "%1 Composto %2 Nome %3 %4 Passos %5",
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
      "type": "field_input",
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
  "tooltip": "Passo Composto de sub-passos",
  "helpUrl": ""
},
{
  "type": "faqstep",
  "message0": "%1 F.A.Q. %2 Mensagem %3 Percentual mínimo %4 %5 Durável? %6 %7 Configurações %8",
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
  "tooltip": "Passo de consulta a perguntas frequentes",
  "helpUrl": ""
},
{
  "type": "faqsettings",
  "message0": "Configurações de FAQ %1 %2 %3 Id da base %4 %5 Chave %6 %7 Url %8 %9 Quantidade de respostas %10",
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
          "Tipo de Serviço",
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
      "type": "field_input",
      "name": "KnowledgeBaseId",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "EndpointKey",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
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
  "tooltip": "Configurações do serviço de FAQ",
  "helpUrl": ""
},
{
  "type": "mapsstep",
  "message0": "%1 Mapas %2 %3 %4 Chave da Api %5 %6 Endereços %7 Selecionável? %8 %9 Durável? %10 %11 Fonte de dados %12",
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
          "Serviço",
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
      "type": "field_input",
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
  "tooltip": "Passo de lista de mapas",
  "helpUrl": ""
},
{
  "type": "locationsource",
  "lastDummyAlign0": "RIGHT",
  "message0": "Endereço %1 Nome %2 %3 Latitude %4 Longitude %5 %6 CEP %7 Logradouro %8 %9 UF %10 Cidade %11",
  "args0": [
    {
      "type": "input_dummy",
      "align": "CENTRE"
    },
    {
      "type": "field_input",
      "name": "Name",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "Latitude",
      "text": ""
    },
    {
      "type": "field_input",
      "name": "Longitude",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "ZipCode",
      "text": ""
    },
    {
      "type": "field_input",
      "name": "Address",
      "text": ""
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "State",
      "text": ""
    },
    {
      "type": "field_input",
      "name": "City",
      "text": ""
    }
  ],
  "previousStatement": "LocationSource",
  "nextStatement": "LocationSource",
  "colour": 60,
  "tooltip": "Passo de consulta a perguntas frequentes",
  "helpUrl": ""
},
{
  "type": "switchstep",
  "message0": "%1 Escolha %2 %3 Casos %4 Fonte de dados %5",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "Id",
      "text": ""
    },
    {
      "type": "field_input",
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
  "tooltip": "Passo de escolha - caso",
  "helpUrl": ""
},
{
  "type": "case",
  "message0": "Caso %1 %2 Faça %3",
  "args0": [
    {
      "type": "field_input",
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
  "tooltip": "Passo de escolha - caso",
  "helpUrl": ""
},
{
  "type": "imageclassificationstep",
  "message0": "%1 Classificação de Imagem %2 Pergunta %3 Retentativas %4 Muitas tentativas %5 Durável? %6 %7 Tentativas %8 %9 Resultados %10 %11 Percentual mínimo %12 %13 Ir para o passo %14 se falhar %15 Configurações %16",
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
  "tooltip": "Passo de classificação de imagens",
  "helpUrl": ""
},
{
  "type": "imageclassificationsettings",
  "lastDummyAlign0": "RIGHT",
  "message0": "Config. de classificação de imagens %1 %2 %3 %4 %5 Predição %6 %7 %8 Treinamento %9 %10",
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
          "Tipo de serviço",
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
      "type": "field_input",
      "name": "ProjectId",
      "text": "Id do Projeto"
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "PredictionEndpoint",
      "text": "Url"
    },
    {
      "type": "field_input",
      "name": "PredictionKey",
      "text": "Chave"
    },
    {
      "type": "input_dummy",
      "align": "RIGHT"
    },
    {
      "type": "field_input",
      "name": "TrainingEndpoint",
      "text": "Url"
    },
    {
      "type": "field_input",
      "name": "TrainingKey",
      "text": "Chave"
    }
  ],
  "output": "ImageClassificationSettings",
  "colour": 180,
  "tooltip": "Configurações de serviço de classificação de imagens",
  "helpUrl": ""
},
{
  "type": "readgpslocationstep",
  "lastDummyAlign0": "RIGHT",
  "message0": "%1 Localização de GPS %2 Pergunta %3 Retentativas %4 Muitas tentativas %5 Durável? %6 %7 Tentativas %8 %9 Ir para o passo %10 se falhar",
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
  "tooltip": "Passo de classificação de imagens",
  "helpUrl": ""
},
{
  "type": "transformation",
  "lastDummyAlign0": "CENTRE",
  "message0": "de %1 para %2",
  "args0": [
    {
      "type": "field_input",
      "name": "InputExpression",
      "text": ""
    },
    {
      "type": "field_input",
      "name": "OutputExpression",
      "text": ""
    }
  ],
  "previousStatement": "Transformation",
  "nextStatement": "Transformation",
  "colour": 210,
  "tooltip": "Transformação",
  "helpUrl": ""
},
{
  "type": "file",
  "message0": "Arquivo %1 Nome %2 %3 Url %4",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "Filename",
      "text": ""
    },
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
      "name": "Url",
      "text": "http://"
    }
  ],
  "previousStatement": "File",
  "nextStatement": "File",
  "colour": 290,
  "tooltip": "Arquivo para download",
  "helpUrl": ""
},
{
  "type": "handoffstep",
  "lastDummyAlign0": "RIGHT",
  "message0": "%1 Derivar para %2 %3 Durável? %4",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "Id",
      "text": ""
    },
    {
      "type": "field_input",
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
  "tooltip": "Passo de derivação",
  "helpUrl": ""
},
{
  "type": "transformstep",
  "message0": "%1 Transformação %2 Origem %3 %4 Transformações %5 Fonte de dados %6",
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
      "type": "field_input",
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
  "tooltip": "Passo de transformações",
  "helpUrl": ""
},
{
  "type": "simplemessagestep",
  "message0": "%1 Mensagem %2",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "Id",
      "text": ""
    },
    {
      "type": "field_input",
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
  "tooltip": "Passo de mensagem",
  "helpUrl": ""
},
{
  "type": "simpleinputstep",
  "message0": "%1 Pergunta %2",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "Id",
      "text": ""
    },
    {
      "type": "field_input",
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
  "tooltip": "Passo de pergunta aberta",
  "helpUrl": ""
},
{
  "type": "simpleconfirmstep",
  "message0": "%1 Confirmação %2 %3 Passos para \"Sim\" %4 Passos para \"Não\" %5",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "Id",
      "text": ""
    },
    {
      "type": "field_input",
      "name": "Mensagem",
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
  "tooltip": "Passo de confirmação",
  "helpUrl": ""
},
{
  "type": "simpleliststep",
  "message0": "%1 Lista de Botões %2 %3 Itens %4",
  "args0": [
    {
      "type": "field_label_serializable",
      "name": "Id",
      "text": ""
    },
    {
      "type": "field_input",
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
  "tooltip": "Passo de lista",
  "helpUrl": ""
},
{
  "type": "simplelistitem",
  "message0": "Navegar para passo %1 Título %2 %3 Passos %4",
  "args0": [
    {
      "type": "input_dummy"
    },
    {
      "type": "field_input",
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
  "tooltip": "Item de lista para navegar para passos filhos",
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
