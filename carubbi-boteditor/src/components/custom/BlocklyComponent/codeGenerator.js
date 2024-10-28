import Blockly from 'blockly/core';

const JsonBotDefinition = new Blockly.Generator('JsonBotDefinition');
JsonBotDefinition.ORDER_NONE = 99;
JsonBotDefinition.ORDER_ATOMIC = 0;
JsonBotDefinition.ORDER_STRING = 1;

let stepsToAddLater = {};
let currentScope = "botconfig";

const relationalOperators = {
    "Equals": "=",
    "Greater": ">",
    "Less": "<",
    "GreaterOrEquals": ">=",
    "LessOrEquals": "<=",
    "NotEquals": "<>",
};

const logicalOperators = {
    "And": "&",
    "Or": "|"
};

function getRelationalOperator(operatorDisplay) {
    return relationalOperators[operatorDisplay];
}


function getLogicalOperator(operatorDisplay) {
    return logicalOperators[operatorDisplay];
}

function getFormCustomMessageValues(formCustomMessages, key) {
    // eslint-disable-next-line
    return (formCustomMessages && formCustomMessages.filter(x => x.key.toLowerCase() === key.toLowerCase()).map(x => x.value) || null);
}

function getFormCustomMessageValue(formCustomMessages, key) {
    // eslint-disable-next-line
    return (formCustomMessages && formCustomMessages.filter(x => x.key.toLowerCase() === key.toLowerCase()).map(x => x.value)[0] || null);
}

function getFormCustomComnand(formCustomCommands, type) {
    return (formCustomCommands && formCustomCommands.filter(x => x.type === type)[0]) || null;
}

function statementToArray(stringArray) {
    try {
        var obj = JSON.parse(stringArray);
        if (!Array.isArray(obj)) {
            return [obj];
        } else {
            return obj;
        }
    } catch {
        if (stringArray.length === 0) {
            return [];
        } else {
            return [stringArray];
        }
    }
}

function parseValue(value) {
    if (!value) {
        return value;
    } else {
        var noParenthesesValue = value.substring(1, value.length - 1);
        try {
            return JSON.parse(noParenthesesValue);
        } catch {
            return noParenthesesValue;
        }
    }
}

function addStepsToLater(steps) {
    stepsToAddLater[currentScope] = stepsToAddLater[currentScope] || {};
    stepsToAddLater[currentScope].steps = (Array.isArray(stepsToAddLater[currentScope].steps)
        && stepsToAddLater[currentScope].steps.concat(steps)) ||
        steps;
}

JsonBotDefinition.fromWorkspace = (workspace) => {

    currentScope = 'botconfig';
    stepsToAddLater = {};

    var top_blocks = workspace.getTopBlocks(false);
    for (var i in top_blocks) {
        var top_block = top_blocks[i];
        if (top_block.type === 'botconfig')
            return JsonBotDefinition.generalBlockToObj(top_block, workspace);
    }

};

JsonBotDefinition.generalBlockToObj =  (block, workspace) => {

    if (block && !block.isShadow_) {

        // dispatcher:
        var func = JsonBotDefinition[block.type];
        if (func) {
            return func.call(JsonBotDefinition, block, workspace);
        } else {
            console.log("Don't know how to generate JSON code for a '" + block.type + "'");
        }
    } else {
        return null;
    }
};

JsonBotDefinition.scrub_ = (block, code, opt_thisOnly) => {

    var obj = null;
    try {
        obj = JSON.parse(code);
    }
    catch {
        obj = code;
    }
    var nextBlock = block.getNextBlock();
    if (nextBlock) {
        var array = Array.isArray(obj) ? obj : [obj];
        var nextCode = JsonBotDefinition.blockToCode(nextBlock);
        try {
            var nextObj = JSON.parse(nextCode);
            if (Array.isArray(nextObj)) {
                array = array.concat(nextObj);
            } else {
                array.push(nextObj);
            }
        } catch {
            array.push(nextCode);
        }
        return JSON.stringify(array);
    } else {
        return JSON.stringify(obj);
    }
};

JsonBotDefinition['botconfig'] = (block, workspace) => {
    var text_name = block.getFieldValue('Name');
    var statements_steps = statementToArray(JsonBotDefinition.statementToCode(block, 'Steps'));
    var steps = statements_steps.filter(s => s.$type);
    if (stepsToAddLater['botconfig'] && stepsToAddLater['botconfig'].steps.filter(s => s.$type)) {
        steps = steps.concat(stepsToAddLater['botconfig'].steps.filter(s => s.$type));
    }

    var statements_customcommands = statementToArray(JsonBotDefinition.statementToCode(block, 'CustomCommands'));
    var value_speechsettings = parseValue(JsonBotDefinition.valueToCode(block, 'SpeechSettings', JsonBotDefinition.ORDER_ATOMIC));
    var value_appcredentials = parseValue(JsonBotDefinition.valueToCode(block, 'AppCredentials', JsonBotDefinition.ORDER_ATOMIC));
    var value_storesettings = parseValue(JsonBotDefinition.valueToCode(block, 'StoreSettings', JsonBotDefinition.ORDER_ATOMIC));
    var value_whatsapp = parseValue(JsonBotDefinition.valueToCode(block, 'Whatsapp', JsonBotDefinition.ORDER_ATOMIC));
    var value_telegram = parseValue(JsonBotDefinition.valueToCode(block, 'Telegram', JsonBotDefinition.ORDER_ATOMIC));

    var botJson = {
        name: text_name,
        rootStepId: (statements_steps.length > 0 && statements_steps[0].id) || null,
        steps,
        customCommands: statements_customcommands,
        speechSettings: typeof value_speechsettings === "object" ? value_speechsettings : null,
        appId: (value_appcredentials && value_appcredentials.appId) || null,
        appPassword: (value_appcredentials && value_appcredentials.appPassword) || null,
        persistenceStrategy: (value_storesettings && value_storesettings.persistenceStrategy) || null,
        connectionString: (value_storesettings && value_storesettings.connectionString) || null,
        whatsAppChannel: typeof value_whatsapp === "object" ? value_whatsapp : null,
        telegramChannel: typeof value_telegram === "object" ? value_telegram : null,
    };

    var code = JSON.stringify(botJson);
    return code.replace(/\\\\r/g, "\\r").replace(/\\\\n/g, "\\n");
};

JsonBotDefinition['telegramchannel'] = function(block) {
    var text_telegramtoken = block.getFieldValue('TelegramToken');
    
    const telegramchannel = {
        token: text_telegramtoken,
    };

    const code = JSON.stringify(telegramchannel);

    return [code, JsonBotDefinition.ORDER_NONE];
  };
  
  JsonBotDefinition['whatsappchannel'] = function(block) {
    var statements_phonenumbers = statementToArray(JsonBotDefinition.statementToCode(block, 'phoneNumbers'));
    
    const whastappchannel = {
        phoneNumbers: statements_phonenumbers,
    };

    const code = JSON.stringify(whastappchannel);

    return [code, JsonBotDefinition.ORDER_NONE];
  };


JsonBotDefinition['messagestep'] = (block) => {
    var label_id = block.getFieldValue("Id");
    var value_messages = parseValue(JsonBotDefinition.valueToCode(block, 'Messages', JsonBotDefinition.ORDER_ATOMIC));
    var nextBlock = block.getNextBlock();
    var messageStep = {
        $type: "Carubbi.BotEditor.Config.Steps.MessageStep, Carubbi.BotEditor.Config",
        messages: value_messages,
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    var code = JSON.stringify(messageStep);

    return code;
};

JsonBotDefinition['inputstep'] = (block) => {
    var label_id = block.getFieldValue("Id");
    var value_question = parseValue(JsonBotDefinition.valueToCode(block, 'Question', JsonBotDefinition.ORDER_ATOMIC));
    var checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    var value_nlpsettings = parseValue(JsonBotDefinition.valueToCode(block, 'NLPSettings', JsonBotDefinition.ORDER_ATOMIC));
    var value_textanalysissettings = parseValue(JsonBotDefinition.valueToCode(block, 'TextAnalysisSettings', JsonBotDefinition.ORDER_ATOMIC));
    var nextBlock = block.getNextBlock();

    var inputStep = {

        $type: "Carubbi.BotEditor.Config.Steps.InputStep, Carubbi.BotEditor.Config",
        id: label_id,
        question: value_question,
        durable: checkbox_durable,
        textAnalysisSettings: value_textanalysissettings,
        nlpSettings: value_nlpsettings,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    var code = JSON.stringify(inputStep);

    return code;
};

JsonBotDefinition['string'] = (block) => {
    if (block.isShadow_) return null;
    var text_value = block.getFieldValue('Value');
    var code = text_value;
    return code;
};

JsonBotDefinition['nlpsettings'] = (block) => {
    if (block.isShadow_) return null;

    const dropdown_nlpservicetype = block.getFieldValue('NlpServiceType');
    const statements_models = statementToArray(JsonBotDefinition.statementToCode(block, 'Models'));

    const nlpSettings = {
        serviceType: dropdown_nlpservicetype,
        models: statements_models
    };

    const code = JSON.stringify(nlpSettings);

    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['textanalysissettings'] = (block) => {
    if (block.isShadow_) return null;

    const dropdown_textanalysisservicetype = block.getFieldValue('TextAnalysisServiceType');
    const dropdown_language = block.getFieldValue('Language');
    const text_subscriptionkey = block.getFieldValue('SubscriptionKey');
    const text_endpoint = block.getFieldValue('Endpoint');

    const textAnalysisSettings = {
        serviceType: dropdown_textanalysisservicetype,
        language: dropdown_language,
        subscriptionKey: text_subscriptionkey,
        endpoint: text_endpoint,
    };

    const code = JSON.stringify(textAnalysisSettings);

    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['nlpmodel'] = (block) => {
    if (block.isShadow_) return null;

    const text_appid = block.getFieldValue('AppId');
    const text_predictionkey = block.getFieldValue('PredictionKey');
    const text_predictionendpoint = block.getFieldValue('PredictionEndpoint');

    const nlpModel = {
        appId: text_appid,
        endpointPredictionKey: text_predictionkey,
        endpoint: text_predictionendpoint
    };

    const code = JSON.stringify(nlpModel);
    return code;
};

JsonBotDefinition['confirmstep'] = (block) => {
    const label_id = block.getFieldValue("Id");
    const value_question = parseValue(JsonBotDefinition.valueToCode(block, 'Question', JsonBotDefinition.ORDER_ATOMIC));
    const value_retrymessage = parseValue(JsonBotDefinition.valueToCode(block, 'RetryMessage', JsonBotDefinition.ORDER_ATOMIC));
    const value_toomanyattemptsmessage = parseValue(JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', JsonBotDefinition.ORDER_ATOMIC));
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const text_yestext = block.getFieldValue('YesText');
    const text_notext = block.getFieldValue('NoText');
    const statements_yesacceptedanswers = statementToArray(JsonBotDefinition.statementToCode(block, 'YesAcceptedAnswers'));
    const statements_noacceptedanswers = statementToArray(JsonBotDefinition.statementToCode(block, 'NoAcceptedAnswers'));
    const number_attempts = block.getFieldValue('Attempts');
    const statements_truestep = statementToArray(JsonBotDefinition.statementToCode(block, 'TrueStep'));
    const statements_falsestep = statementToArray(JsonBotDefinition.statementToCode(block, 'FalseStep'));

    addStepsToLater(statements_truestep.concat(statements_falsestep));
     
    var confirmStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ConfirmStep, Carubbi.BotEditor.Config",
        id: label_id,
        question: value_question,
        retryMessage: value_retrymessage,
        tooManyAttemptsMessage: value_toomanyattemptsmessage,
        durable: checkbox_durable,
        yesText: text_yestext,
        noText: text_notext,
        yesAcceptedAnswers: statements_yesacceptedanswers,
        noAcceptedAnswers: statements_noacceptedanswers,
        attempts: number_attempts,
        trueStepId: (statements_truestep.length > 0 && statements_truestep[0].id) || null,
        falseStepId: (statements_falsestep.length > 0 && statements_falsestep[0].id) || null,
    };
    console.log(confirmStep);
    var code = JSON.stringify(confirmStep);
    return code;
};


 

JsonBotDefinition['messageinteractions'] = (block) => {
    if (block.isShadow_) return null;
 
    const statements_typed = statementToArray(JsonBotDefinition.statementToCode(block, 'Typed'));
    const statements_spoken = statementToArray(JsonBotDefinition.statementToCode(block, 'Spoken'));
    const statements_files = statementToArray(JsonBotDefinition.statementToCode(block, 'Files'));

    const messageInteractions = {
        typed: statements_typed,
        spoken: statements_spoken,
        files: statements_files,
    };
    const code = JSON.stringify(messageInteractions);
    return [code, JsonBotDefinition.ORDER_NONE];
}; 

JsonBotDefinition['liststep'] = function (block) {
    const label_id = block.getFieldValue("Id");
    const dropdown_listtype = block.getFieldValue('ListType');
    const value_promptmessage = parseValue(JsonBotDefinition.valueToCode(block, 'PromptMessage', JsonBotDefinition.ORDER_ATOMIC));
    const statements_input = statementToArray(JsonBotDefinition.statementToCode(block, 'Input'));
    const value_retrymessage = parseValue(JsonBotDefinition.valueToCode(block, 'RetryMessage', JsonBotDefinition.ORDER_ATOMIC));
    const value_toomanyattemptsmessage = parseValue(JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', JsonBotDefinition.ORDER_ATOMIC));
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const number_attempts = block.getFieldValue('Attempts');
    const value_nlpsettings = parseValue(JsonBotDefinition.valueToCode(block, 'NLPSettings', JsonBotDefinition.ORDER_ATOMIC));
    const value_datasourceexpression = parseValue(JsonBotDefinition.valueToCode(block, 'DataSource', JsonBotDefinition.ORDER_ATOMIC));

    const nextBlock = block.getNextBlock();

    const listStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ListStep, Carubbi.BotEditor.Config",
        id: label_id,
        listType: dropdown_listtype,
        promptMessage: value_promptmessage,
        input: statements_input,
        retryMessage: value_retrymessage,
        tooManyAttemptsMessage: value_toomanyattemptsmessage,
        durable: checkbox_durable,
        attempts: number_attempts,
        nlpSettings: value_nlpsettings,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        dataSourceExpression: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null
    };

    const code = JSON.stringify(listStep);
    return code;
};



JsonBotDefinition['customcommandconfig'] = (block) => {
    if (block.isShadow_) return null;

    const text_commandtext = block.getFieldValue('CommandText');
    const checkbox_startup = block.getFieldValue('Startup') === 'TRUE';
    const checkbox_cleardialogstack = block.getFieldValue('ClearDialogStack') === 'TRUE';
    const checkbox_deleteprofile = block.getFieldValue('DeleteProfile') === 'TRUE';
    const checkbox_invalidatecache = block.getFieldValue('InvalidateCache') === 'TRUE';
    const text_custommessagereply = block.getFieldValue('CustomMessageReply');

    const customCommandConfig = {
        commandText: text_commandtext,
        startup: checkbox_startup,
        clearDialogStack: checkbox_cleardialogstack,
        deleteProfile: checkbox_deleteprofile,
        invalidateCache: checkbox_invalidatecache,
        customMessageReply: text_custommessagereply
    };
    const code = JSON.stringify(customCommandConfig);
    return code;
};



JsonBotDefinition['speechsettings'] = (block) => {
    if (block.isShadow_) return null;

    const dropdown_language = block.getFieldValue('Language');
    const dropdown_recognitionservicetype = block.getFieldValue('RecognitionServiceType');
    const dropdown_recognitionserviceregion = block.getFieldValue('RecognitionServiceRegion');
    const text_recognitionsubscriptionkey = block.getFieldValue('RecognitionSubscriptionKey');
    const dropdown_synthesisservicetype = block.getFieldValue('SynthesisServiceType');
    const dropdown_synthesisserviceregion = block.getFieldValue('SynthesisServiceRegion');
    const text_synthesissubscriptionkey = block.getFieldValue('SynthesisSubscriptionKey');
    const text_voicename = block.getFieldValue('VoiceName');
    const dropdown_cachetype = block.getFieldValue('CacheType');
    const dropdown_storetype = block.getFieldValue('StoreType');

    const speechSettings = {
        recognition: {
            language: dropdown_language,
            serviceType: dropdown_recognitionservicetype,
            serviceRegion: dropdown_recognitionserviceregion,
            subscriptionKey: text_recognitionsubscriptionkey
        },
        synthesis: {
            language: dropdown_language,
            serviceType: dropdown_synthesisservicetype,
            serviceRegion: dropdown_synthesisserviceregion,
            subscriptionKey: text_synthesissubscriptionkey,
            voiceName: text_voicename,
            cacheType: dropdown_cachetype,
            storeType: dropdown_storetype
        }
    };

    const code = JSON.stringify(speechSettings);
    return [code, JsonBotDefinition.ORDER_NONE];
};


JsonBotDefinition['appcredentials'] = (block) => {
    if (block.isShadow_) return null;

    const text_appid = block.getFieldValue('AppId');
    const text_apppassword = block.getFieldValue('AppPassword');

    const appCredentials = {
        appId: text_appid,
        appPassword: text_apppassword
    };

    const code = JSON.stringify(appCredentials);
    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['storesettings'] = function (block) {
    const dropdown_persistencestrategy = block.getFieldValue('PersistenceStrategy');
    const text_connectionstring = block.getFieldValue('ConnectionString');

    const storeSettings = {
        persistenceStrategy: dropdown_persistencestrategy,
        connectionString: text_connectionstring
    };
    const code = JSON.stringify(storeSettings);
    return [code, JsonBotDefinition.ORDER_NONE];
};



JsonBotDefinition['formstep'] = (block) => {
    const label_id = block.getFieldValue("Id");
 
    const statements_formfields = statementToArray(JsonBotDefinition.statementToCode(block, 'FormFields'));
    const value_summary = parseValue(JsonBotDefinition.valueToCode(block, 'Summary', JsonBotDefinition.ORDER_ATOMIC));
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const statements_formcustommessages = statementToArray(JsonBotDefinition.statementToCode(block, 'FormCustomMessages'));
    const statements_formcustomcommands = statementToArray(JsonBotDefinition.statementToCode(block, 'FormCustomCommands'));
    const value_nlpsettings = parseValue(JsonBotDefinition.valueToCode(block, 'NlpSettings', JsonBotDefinition.ORDER_ATOMIC));

    const nextBlock = block.getNextBlock();
    const helpCommand = getFormCustomComnand(statements_formcustomcommands, "help");
    const backupCommand = getFormCustomComnand(statements_formcustomcommands, "backup");
    const resetCommand = getFormCustomComnand(statements_formcustomcommands, "reset");
    const quitCommand = getFormCustomComnand(statements_formcustomcommands, "quit");
    const statusCommand = getFormCustomComnand(statements_formcustomcommands, "status");
    let formFieldId = 1;

    const formStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.FormStep, Carubbi.BotEditor.Config',
        version: 0,
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        formFields: statements_formfields.map(ff => Object.assign(ff, { id: formFieldId++ })),
        durable: checkbox_durable,
        showSummary: value_summary ? true : false,
        summaryText: (value_summary && value_summary.summaryText) || null,
        includeFieldListOnSummary: (value_summary && value_summary.includeFieldListOnSummary) || null,
        includeConfirmationButtonsOnSummary: (value_summary && value_summary.includeConfirmationButtonsOnSummary) || null,
        nlpSettings: value_nlpsettings,
        configuration: {
            yes: getFormCustomMessageValues(statements_formcustommessages, 'yes'),
            no: getFormCustomMessageValues(statements_formcustommessages, 'no'),
            noPreferenceMessage: getFormCustomMessageValues(statements_formcustommessages, 'noPreferenceMessage'),
            choiceLastSeparator: getFormCustomMessageValue(statements_formcustommessages, 'choiceLastSeparator'),
            lastSeparator: getFormCustomMessageValue(statements_formcustommessages, 'lastSeparator'),
            navigationFieldName: getFormCustomMessageValue(statements_formcustommessages, 'navigationFieldName'),
            currentChoiceMessage: getFormCustomMessageValues(statements_formcustommessages, 'currentChoiceMessage'),
            boolHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'boolHelpMessage'),
            boolMessage: getFormCustomMessageValue(statements_formcustommessages, 'boolMessage'),
            clarifyMessage: getFormCustomMessageValue(statements_formcustommessages, 'clarifyMessage'),
            confirmationMessage: getFormCustomMessageValue(statements_formcustommessages, 'confirmationMessage'),
            dateTimeMessage: getFormCustomMessageValue(statements_formcustommessages, 'dateTimeMessage'),
            dateTimeHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'dateTimeHelpMessage'),
            doubleHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'doubleHelpMessage'),
            doubleMessage: getFormCustomMessageValue(statements_formcustommessages, 'doubleMessage'),
            enumManyNumberHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'enumManyNumberHelpMessage'),
            enumOneNumberHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'enumOneNumberHelpMessage'),
            enumSelectManyMessage: getFormCustomMessageValue(statements_formcustommessages, 'enumSelectManyMessage'),
            enumOneWordHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'enumOneWordHelpMessage'),
            enumSelectOneMessage: getFormCustomMessageValue(statements_formcustommessages, 'enumSelectOneMessage'),
            feedBackMessage: getFormCustomMessageValue(statements_formcustommessages, 'feedBackMessage'),
            helpMessage: getFormCustomMessageValue(statements_formcustommessages, 'helpMessage'),
            helpClarifyMessage: getFormCustomMessageValue(statements_formcustommessages, 'helpClarifyMessage'),
            helpConfirmMessage: getFormCustomMessageValue(statements_formcustommessages, 'helpConfirmMessage'),
            helpNavigationMessage: getFormCustomMessageValue(statements_formcustommessages, 'helpNavigationMessage'),
            integerMessage: getFormCustomMessageValue(statements_formcustommessages, 'integerMessage'),
            integerHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'integerHelpMessage'),
            navigationMessage: getFormCustomMessageValue(statements_formcustommessages, 'navigationMessage'),
            navigationCommandHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'navigationCommandHelpMessage'),
            navigationFormatMessage: getFormCustomMessageValue(statements_formcustommessages, 'navigationFormatMessage'),
            navigationHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'navigationHelpMessage'),
            notUnderstoodMessage: getFormCustomMessageValue(statements_formcustommessages, 'notUnderstoodMessage'),
            statusFormatMessage: getFormCustomMessageValue(statements_formcustommessages, 'statusFormatMessage'),
            stringMessage: getFormCustomMessageValue(statements_formcustommessages, 'stringMessage'),
            stringHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'stringHelpMessage'),
            unspecifiedMessage: getFormCustomMessageValue(statements_formcustommessages, 'unspecifiedMessage'),
            enumManyWordHelpMessage: getFormCustomMessageValue(statements_formcustommessages, 'enumManyWordHelpMessage'),
            commands: {
                helpDescription: (helpCommand && helpCommand.description) || null,
                helpTerms: (helpCommand && [helpCommand.terms]) || null,
                helpHelpMessage: (helpCommand && helpCommand.helpMessage) || null,
                backupDescription: (backupCommand && backupCommand.description) || null,
                backupTerms: (backupCommand && [backupCommand.terms]) || null,
                backupHelpMessage: (backupCommand && backupCommand.helpMessage) || null,
                resetDescription: (resetCommand && resetCommand.description) || null,
                resetTerms: (resetCommand && [resetCommand.terms]) || null,
                resetHelpMessage: (resetCommand && resetCommand.helpMessage) || null,
                quitDescription: (quitCommand && quitCommand.description) || null,
                quitTerms: (quitCommand && [quitCommand.terms]) || null,
                quitHelpMessage: (quitCommand && quitCommand.helpMessage) || null,
                statusDescription: (statusCommand && statusCommand.description) || null,
                statusTerms: (statusCommand && [statusCommand.terms]) || null,
                statusHelpMessage: (statusCommand && statusCommand.helpMessage) || null,
            }
        }
    };

    var code = JSON.stringify(formStep);
    return code;
};

JsonBotDefinition['formfield'] = (block) => {
    if (block.isShadow_) return null;

    const text_name = block.getFieldValue('Name');
    const text_question = block.getFieldValue('Question');
    const checkbox_optional = block.getFieldValue('Optional') === 'TRUE';
    const dropdown_type = block.getFieldValue('Type');
    const text_nlpentityname = block.getFieldValue('NlpEntityName');
    const text_validationapiurl = block.getFieldValue('ValidationApiURL');
    const text_validationfailedmessage = block.getFieldValue('ValidationFailedMessage');
    const text_activeapiurl = block.getFieldValue('ActiveApiURL');

    const formField = {
        name: text_name,
        question: text_question,
        optional: checkbox_optional,
        type: dropdown_type,
        nlpentityName: text_nlpentityname,
        validationApiUrl: text_validationapiurl,
        validationFailedMessage: text_validationfailedmessage,
        activeApiUrl: text_activeapiurl,
    };

    const code = JSON.stringify(formField);
    return code;
};

JsonBotDefinition['optionsformfield'] = (block) => {
    if (block.isShadow_) return null;

    const text_name = block.getFieldValue('Name');
    const text_question = block.getFieldValue('Question');
    const checkbox_optional = block.getFieldValue('Optional') === 'TRUE';
    const dropdown_type = block.getFieldValue('Type');
    const statements_options = statementToArray(JsonBotDefinition.statementToCode(block, 'Options'));
    const text_nlpentityname = block.getFieldValue('NlpEntityName');
    const text_validationapiurl = block.getFieldValue('ValidationApiURL');
    const text_validationfailedmessage = block.getFieldValue('ValidationFailedMessage');
    const text_activeapiurl = block.getFieldValue('ActiveApiURL');
    const optionsSource = (statements_options && statements_options[0] && statements_options[0].optionsSource) || null;

    const optionsFormField = {
        name: text_name,
        question: text_question,
        optional: checkbox_optional,
        type: dropdown_type,
        nlpentityName: text_nlpentityname,
        validationApiUrl: text_validationapiurl,
        validationFailedMessage: text_validationfailedmessage,
        activeApiUrl: text_activeapiurl,
        options: (!optionsSource && statements_options) || null,
        optionsSource: optionsSource
    };

    const code = JSON.stringify(optionsFormField);

    return code;
};

JsonBotDefinition['fieldoption'] = (block) => {
    if (block.isShadow_) return null;

    const text_value = block.getFieldValue('Value');
    const text_description = block.getFieldValue('Description');

    const fieldOption = {
        value: text_value,
        description: text_description
    };

    const code = JSON.stringify(fieldOption);
    return code;
};

JsonBotDefinition['fieldoptionsource'] = (block) => {
    if (block.isShadow_) return null;

    const text_optionssource = block.getFieldValue('OptionsSource');

    const fieldOptionSource = {
        optionsSource: text_optionssource,
    };

    const code = JSON.stringify(fieldOptionSource);
    return code;
};

JsonBotDefinition['restoreformfield'] = (block) => {
    if (block.isShadow_) return null;

    const text_name = block.getFieldValue('Name');
    const text_question = block.getFieldValue('Question');
    const statements_restorefields = statementToArray(JsonBotDefinition.statementToCode(block, 'RestoreFields'));

    const formField = {
        name: text_name,
        question: text_question,
        restoreFields: statements_restorefields,
        type: 'Restore'
    };

    const code = JSON.stringify(formField);

    return code;
};

JsonBotDefinition['summary'] = (block) => {
    if (block.isShadow_) return null;

    const text_summarytext = block.getFieldValue('SummaryText');
    const checkbox_includefieldlistonsummary = block.getFieldValue('IncludeFieldListOnSummary') === 'TRUE';
    const checkbox_includeconfirmationbuttonsonsummary = block.getFieldValue('IncludeConfirmationButtonsOnSummary') === 'TRUE';

    const summary = {
        summaryText: text_summarytext,
        includeFieldListOnSummary: checkbox_includefieldlistonsummary,
        includeConfirmationButtonsOnSummary: checkbox_includeconfirmationbuttonsonsummary
    };

    const code = JSON.stringify(summary);
    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['formcustommessage'] = (block) => {
    if (block.isShadow_) return null;

    const dropdown_key = block.getFieldValue('Key');
    const text_value = block.getFieldValue('Value');

    const formCustomMessage = {
        key: dropdown_key,
        value: text_value
    };

    const code = JSON.stringify(formCustomMessage);
    return code;
};


JsonBotDefinition['formcustomcommand'] = (block) => {
    if (block.isShadow_) return null;

    const dropdown_commandtype = block.getFieldValue('CommandType');
    const text_description = block.getFieldValue('Description');
    const text_terms = block.getFieldValue('Terms');
    const text_helpmessage = block.getFieldValue('HelpMessage');

    const formCustomCommand = {
        commandType: dropdown_commandtype,
        description: text_description,
        terms: text_terms,
        helpMessage: text_helpmessage
    };

    const code = JSON.stringify(formCustomCommand);
    return code;
};

JsonBotDefinition['datasource'] = (block) => {
    if (block.isShadow_) return null;

    const number_stepid = block.getFieldValue('StepId');
    const text_expression = block.getFieldValue('Expression');

    const dataSource = {
        stepId: number_stepid,
        expression: text_expression
    };

    const code = JSON.stringify(dataSource);

    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['conditionstep'] = (block) => {
    const label_id = block.getFieldValue("Id");
    const value_conditionexpression = parseValue(JsonBotDefinition.valueToCode(block, 'ConditionExpression', JsonBotDefinition.ORDER_ATOMIC));
    const statements_truestep = statementToArray(JsonBotDefinition.statementToCode(block, 'TrueStep'));
    const statements_falsestep = statementToArray(JsonBotDefinition.statementToCode(block, 'FalseStep'));
    const value_datasourceexpression = parseValue(JsonBotDefinition.valueToCode(block, 'DataSource', JsonBotDefinition.ORDER_ATOMIC));

    addStepsToLater(statements_truestep.concat(statements_falsestep));

    const conditionStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ConditionStep, Carubbi.BotEditor.Config",
        id: label_id,
        conditionExpression: value_conditionexpression,
        dataSourceExpression: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null,
        trueStepId: (statements_truestep.length > 0 && statements_truestep[0].id) || null,
        falseStepId: (statements_falsestep.length > 0 && statements_falsestep[0].id) || null,
    };

    const code = JSON.stringify(conditionStep);
    return code;
};

JsonBotDefinition['relationalexpression'] = (block) => {
    if (block.isShadow_) return null;

    const value_left = parseValue(JsonBotDefinition.valueToCode(block, 'Left', JsonBotDefinition.ORDER_ATOMIC));
    const dropdown_operator = block.getFieldValue('Operator');
    const value_right = parseValue(JsonBotDefinition.valueToCode(block, 'Right', JsonBotDefinition.ORDER_ATOMIC));

    const code = `(${value_left} ${getRelationalOperator(dropdown_operator)} ${value_right})`;
    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['binarylogicalexpression'] = (block) => {
    if (block.isShadow_) return null;

    const value_left = parseValue(JsonBotDefinition.valueToCode(block, 'Left', JsonBotDefinition.ORDER_ATOMIC));
    const dropdown_operator = block.getFieldValue('Operator');
    const value_right = parseValue(JsonBotDefinition.valueToCode(block, 'Right', JsonBotDefinition.ORDER_ATOMIC));

    const code = `(${value_left} ${getLogicalOperator(dropdown_operator)} ${value_right})`;

    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['unarylogicalexpression'] = (block) => {
    if (block.isShadow_) return null;

    const value_left = parseValue(JsonBotDefinition.valueToCode(block, 'Left', JsonBotDefinition.ORDER_ATOMIC));
    const code = `(!${value_left})`
    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['stepexpression'] = (block) => {
    if (block.isShadow_) return null;

    const text_expression = block.getFieldValue('Expression');
    const number_stepid = block.getFieldValue('StepId');

    const code = `@${number_stepid}.${text_expression}`;

    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['literal'] = (block) => {
    if (block.isShadow_) return null;

    const text_value = block.getFieldValue('Value');
    const code = text_value;
    return [code, JsonBotDefinition.ORDER_NONE];
};


JsonBotDefinition['navigatelistitem'] = (block) => {
    if (block.isShadow_) return null;
    const text_title = block.getFieldValue('Title');
    const text_subtitle = block.getFieldValue('SubTitle');
    const text_imageurl = block.getFieldValue('ImageUrl');
    const text_buttontitle = block.getFieldValue('ButtonTitle');
    const text_buttonvalue = block.getFieldValue('ButtonValue');
    const statements_targetstep = statementToArray(JsonBotDefinition.statementToCode(block, 'TargetStep'));

    addStepsToLater(statements_targetstep);

    const listItem = {
        title: text_title,
        subtitle: text_subtitle,
        imageUrl: text_imageurl,
        buttonTitle: text_buttontitle,
        buttonValue: text_buttonvalue,
        action: 'NavigateStep',
        targetStepId: statements_targetstep.length > 0 ? statements_targetstep[0].id : null
    };

    const code = JSON.stringify(listItem);
    return code;
};

JsonBotDefinition['openurllistitem'] =  (block) => {
    if (block.isShadow_) return null;
    const text_title = block.getFieldValue('Title');
    const text_subtitle = block.getFieldValue('SubTitle');
    const text_imageurl = block.getFieldValue('ImageUrl');
    const text_buttontitle = block.getFieldValue('ButtonTitle');
    const text_buttonvalue = block.getFieldValue('ButtonValue');

    const listItem = {
        title: text_title,
        subtitle: text_subtitle,
        imageUrl: text_imageurl,
        buttonTitle: text_buttontitle,
        buttonValue: text_buttonvalue,
        action: 'OpenURL',
    };

    const code = JSON.stringify(listItem);
    return code;
};

JsonBotDefinition['downloadfilelistitem'] = (block) => {
    if (block.isShadow_) return null;
    const text_title = block.getFieldValue('Title');
    const text_subtitle = block.getFieldValue('SubTitle');
    const text_imageurl = block.getFieldValue('ImageUrl');
    const text_buttontitle = block.getFieldValue('ButtonTitle');
    const text_buttonvalue = block.getFieldValue('ButtonValue');

    const listItem = {
        title: text_title,
        subtitle: text_subtitle,
        imageUrl: text_imageurl,
        buttonTitle: text_buttontitle,
        buttonValue: text_buttonvalue,
        action: 'DownloadFile',
    };

    const code = JSON.stringify(listItem);
    return code;
};


JsonBotDefinition['apistep'] = (block) => {
    const label_id = block.getFieldValue("Id");
    const dropdown_verb = block.getFieldValue('Verb');
    const text_apiurl = block.getFieldValue('ApiURL');
    const text_resource = block.getFieldValue('Resource');
    const statements_parameters = statementToArray(JsonBotDefinition.statementToCode(block, 'Parameters'));
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const value_datasourceexpression = parseValue(JsonBotDefinition.valueToCode(block, 'DataSource', JsonBotDefinition.ORDER_ATOMIC));
    const value_loadingmessage = parseValue(JsonBotDefinition.valueToCode(block, 'LoadingMessage', JsonBotDefinition.ORDER_ATOMIC));
    
    const nextBlock = block.getNextBlock();

    const apiStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ApiStep, Carubbi.BotEditor.Config",
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        verb: dropdown_verb,
        apiUrl: text_apiurl,
        resource: text_resource,
        parameters: statements_parameters,
        durable: checkbox_durable,
        dataSourceExpression: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null,
        loadingMessage: value_loadingmessage
    };

    const code = JSON.stringify(apiStep);
    return code;
};

JsonBotDefinition['apiparameter'] = (block) => {
    const text_name = block.getFieldValue('Name');
    const text_value = block.getFieldValue('Value');
    const dropdown_type = block.getFieldValue('Type');

    const apiParameter = {
        name: text_name,
        value: text_value,
        type: dropdown_type
    };

    const code = JSON.stringify(apiParameter);
    return code;
};


JsonBotDefinition['goto'] =  (block) => {
    const number_id = block.getFieldValue('Id');
    const code = JSON.stringify({ id: number_id });
    return code;
};

JsonBotDefinition['compositestep'] = (block) => {
    const parentScope = currentScope;
    const nextBlock = block.getNextBlock();
    const label_id = block.getFieldValue('Id');
    const text_name = block.getFieldValue('Name');
    currentScope = text_name;

    const statements_steps = statementToArray(JsonBotDefinition.statementToCode(block, 'Steps'));

    let steps = statements_steps.filter(s => s.$type);
    if (stepsToAddLater[currentScope] && stepsToAddLater[currentScope].steps.filter(s => s.$type)) {
        steps =  steps.concat(stepsToAddLater[currentScope].steps.filter(s => s.$type));
    }

    const compositeStep = {
        $type: "Carubbi.BotEditor.Config.Steps.CompositeStep, Carubbi.BotEditor.Config",
        id: label_id,
        name: text_name,
        steps: steps,
        rootStepId: (statements_steps.length > 0 && statements_steps[0].id) || null,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    currentScope = parentScope;

    const code = JSON.stringify(compositeStep);
    return code;
};

JsonBotDefinition['faqstep'] = (block) => {
    const label_id = block.getFieldValue('Id');
    const value_askquestionmessage = parseValue(JsonBotDefinition.valueToCode(block, 'AskQuestionMessage', JsonBotDefinition.ORDER_ATOMIC));
    const number_minimumscore = block.getFieldValue('MinimumScore');
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const value_faqsettings = parseValue(JsonBotDefinition.valueToCode(block, 'FaqSettings', JsonBotDefinition.ORDER_ATOMIC));
    const nextBlock = block.getNextBlock();

    const faqStep = {
        $type: "Carubbi.BotEditor.Config.Steps.FaqStep, Carubbi.BotEditor.Config",
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        askQuestionMessage: value_askquestionmessage,
        minimumScore: number_minimumscore,
        durable: checkbox_durable,
        faqSettings: value_faqsettings,
    };

    const code = JSON.stringify(faqStep);
    return code;
};

JsonBotDefinition['faqsettings'] = (block) => {
    const dropdown_servicetype = block.getFieldValue('ServiceType');
    const text_knowledgebaseid = block.getFieldValue('KnowledgeBaseId');
    const text_endpointkey = block.getFieldValue('EndpointKey');
    const text_endpoint = block.getFieldValue('Endpoint');
    const number_maxanswers = block.getFieldValue('MaxAnswers');

    const faqSettings = {
        serviceType: dropdown_servicetype,
        knowledgeBaseId: text_knowledgebaseid,
        endpointKey: text_endpointkey,
        endpoint: text_endpoint,
        maxAnswers: number_maxanswers
    };
    const code = JSON.stringify(faqSettings);

    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['mapsstep'] =  (block) => {
   
    const dropdown_servicetype = block.getFieldValue('ServiceType');
    const label_id = block.getFieldValue('Id');
    const statements_input = statementToArray(JsonBotDefinition.statementToCode(block, 'Input'));
    const checkbox_selectable = block.getFieldValue('Selectable') === 'TRUE';
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const apiKey = block.getFieldValue('ApiKey');
    const value_datasourceexpression = parseValue(JsonBotDefinition.valueToCode(block, 'DataSource', JsonBotDefinition.ORDER_ATOMIC));
    const nextBlock = block.getNextBlock();
 
    const mapsStep = {
        $type: "Carubbi.BotEditor.Config.Steps.MapsStep, Carubbi.BotEditor.Config",
        id: label_id,
        apiKey: apiKey,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        selectable: checkbox_selectable,
        durable: checkbox_durable,
        dataSourceExpression: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null,
        input: statements_input,
        serviceType: dropdown_servicetype
    };

    const code = JSON.stringify(mapsStep);
    return code;
};

JsonBotDefinition['locationsource'] = (block) => {

    const text_name = block.getFieldValue('Name');
    const text_latitude = block.getFieldValue('Latitude');
    const text_longitude = block.getFieldValue('Longitude');
    const text_zipcode = block.getFieldValue('ZipCode');
    const text_address = block.getFieldValue('Address');
    const text_state = block.getFieldValue('State');
    const text_city = block.getFieldValue('City');

    const locationSource = {
        name: text_name,
        latitude: text_latitude,
        longitude: text_longitude,
        zipCode: text_zipcode,
        address: text_address,
        state: text_state,
        city: text_city
    };

    const code = JSON.stringify(locationSource);
    return code;
};

JsonBotDefinition['switchstep'] = (block) => {
    const text_input = block.getFieldValue('Input');
    const statements_cases = statementToArray(JsonBotDefinition.statementToCode(block, 'Cases'));
    const value_datasourceexpression = parseValue(JsonBotDefinition.valueToCode(block, 'DataSource', JsonBotDefinition.ORDER_ATOMIC));
    const label_id = block.getFieldValue("Id");
    const nextBlock = block.getNextBlock();
    
    const switchStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.SwitchStep, Carubbi.BotEditor.Config',
        id: label_id,
        input: text_input,
        cases: statements_cases,
        dataSourceExpression: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    const code = JSON.stringify(switchStep);
    return code;
};

JsonBotDefinition['case'] = (block) => {
    const text_value = block.getFieldValue('Value');
    const statements_targetstep = statementToArray(JsonBotDefinition.statementToCode(block, 'TargetStep'));

    addStepsToLater(statements_targetstep);

    const $case = {
        value: text_value,
        targetStepId: statements_targetstep.length > 0 ? statements_targetstep[0].id : null
    };

    const code = JSON.stringify($case);
    return code;
};

JsonBotDefinition['imageclassificationstep'] = (block) => {
    const value_askimagemessage = parseValue(JsonBotDefinition.valueToCode(block, 'AskImageMessage', JsonBotDefinition.ORDER_ATOMIC));
    const value_retrymessage = parseValue(JsonBotDefinition.valueToCode(block, 'RetryMessage', JsonBotDefinition.ORDER_ATOMIC));
    const value_toomanyattemptsmessage = parseValue(JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', JsonBotDefinition.ORDER_ATOMIC));
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const number_attempts = block.getFieldValue('Attempts');
    const number_maxresults = block.getFieldValue('MaxResults');
    const number_minscore = block.getFieldValue('MinScore');
    const number_errorstepid = block.getFieldValue('ErrorStepId');
    const value_imageclassificationsettings = parseValue(JsonBotDefinition.valueToCode(block, 'ImageClassificationSettings', JsonBotDefinition.ORDER_ATOMIC));
    const label_id = block.getFieldValue("Id");
    const nextBlock = block.getNextBlock();

    const imageClassificationStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.ImageClassificationStep, Carubbi.BotEditor.Config',
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        askImageMessage: value_askimagemessage,
        retryMessage: value_retrymessage,
        tooManyAttemptsMessage: value_toomanyattemptsmessage,
        durable: checkbox_durable,
        attempts: number_attempts,
        maxResults: number_maxresults,
        minScore: number_minscore,
        errorStepId: number_errorstepid,
        imageClassificationSettings: value_imageclassificationsettings,
    };

    const code = JSON.stringify(imageClassificationStep);
    return code;
};

JsonBotDefinition['imageclassificationsettings'] = (block) => {
    const dropdown_servicetype = block.getFieldValue('ServiceType');
    const text_projectid = block.getFieldValue('ProjectId');
    const text_predictionendpoint = block.getFieldValue('PredictionEndpoint');
    const text_predictionkey = block.getFieldValue('PredictionKey');
    const text_trainingendpoint = block.getFieldValue('TrainingEndpoint');
    const text_trainingkey = block.getFieldValue('TrainingKey');

    const imageClassificationSettings = {
        serviceType: dropdown_servicetype,
        projectId: text_projectid,
        predictionEndpoint: text_predictionendpoint,
        predictionKey: text_predictionkey,
        trainingEndpoint: text_trainingendpoint,
        trainingKey: text_trainingkey,
    };

    const code = JSON.stringify(imageClassificationSettings);
    return [code, JsonBotDefinition.ORDER_NONE];
};

JsonBotDefinition['readgpslocationstep'] = function (block) {
    const value_asklocationmessage = parseValue(JsonBotDefinition.valueToCode(block, 'AskLocationMessage', JsonBotDefinition.ORDER_ATOMIC));
    const value_retrymessage = parseValue(JsonBotDefinition.valueToCode(block, 'RetryMessage', JsonBotDefinition.ORDER_ATOMIC));
    const value_toomanyattemptsmessage = parseValue(JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', JsonBotDefinition.ORDER_ATOMIC));
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const number_attempts = block.getFieldValue('Attempts');
    const number_errorstepid = block.getFieldValue('ErrorStepId');
    const nextBlock = block.getNextBlock();
    const label_id = block.getFieldValue("Id");

    const readGpsLocationStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.ReadGPSLocationStep, Carubbi.BotEditor.Config',
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        askLocationMessage: value_asklocationmessage,
        durable: checkbox_durable,
        attempts: number_attempts,
        retryMessage: value_retrymessage,
        tooManyAttemptsMessage: value_toomanyattemptsmessage,
        errorStepId: number_errorstepid
    };

    const code = JSON.stringify(readGpsLocationStep);
    return code;
};

JsonBotDefinition['transformstep'] = (block)  => {
    const text_propertypath = block.getFieldValue('PropertyPath');
    const statements_transformations = statementToArray(JsonBotDefinition.statementToCode(block, 'Transformations'));
    const value_datasourceexpression = parseValue(JsonBotDefinition.valueToCode(block, 'DataSource', JsonBotDefinition.ORDER_ATOMIC));
    const nextBlock = block.getNextBlock();
    const label_id = block.getFieldValue("Id");

    const transformStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.TransformStep, Carubbi.BotEditor.Config',
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        propertyPath: text_propertypath,
        transformations: statements_transformations,
        dataSourceExpression: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null
    };

    const code = JSON.stringify(transformStep);

    return code;
};

JsonBotDefinition['transformation'] = (block) => {
    const text_inputexpression = block.getFieldValue('InputExpression');
    const text_outputexpression = block.getFieldValue('OutputExpression');

    const transformation = {
        inputExpression: text_inputexpression,
        outputExpression: text_outputexpression,
    };

    const code = JSON.stringify(transformation);

    return code;
};

JsonBotDefinition['file'] = (block) => {
    var text_filename = block.getFieldValue('Filename');
    var text_url = block.getFieldValue('Url');
     
    const file = {
        filename: text_filename,
        url: text_url,
    };

    const code = JSON.stringify(file);
    return code;
  };

  JsonBotDefinition['handoffstep'] = function(block) {
    const text_url = block.getFieldValue('URL');
    const checkbox_durable = block.getFieldValue('Durable') === 'TRUE';
    const nextBlock = block.getNextBlock();
    const label_id = block.getFieldValue("Id");

    const handoffStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.HandoffStep, Carubbi.BotEditor.Config',
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        endpoint: text_url,
        durable: checkbox_durable
    };
    const code = JSON.stringify(handoffStep);
    return code;
  };


  JsonBotDefinition['simplemessagestep'] = function(block) {
    const text_message = block.getFieldValue('Message');
    const label_id = block.getFieldValue("Id");
    const value_messages = {
        typed: [ text_message ]
    };
    
    const nextBlock = block.getNextBlock();
    const messageStep = {
        $type: "Carubbi.BotEditor.Config.Steps.MessageStep, Carubbi.BotEditor.Config",
        messages: value_messages,
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    const code = JSON.stringify(messageStep);

    return code;
  };
  
  JsonBotDefinition['simpleinputstep'] = function(block) {
    const text_message = block.getFieldValue('Message');

    const label_id = block.getFieldValue("Id");
    const value_question = { typed: [ text_message ] };
    const nextBlock = block.getNextBlock();

    const inputStep = {
        $type: "Carubbi.BotEditor.Config.Steps.InputStep, Carubbi.BotEditor.Config",
        id: label_id,
        question: value_question,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    const code = JSON.stringify(inputStep);

    return code;
  };
  
  JsonBotDefinition['simpleconfirmstep'] = function(block) {
   
    const text_message = block.getFieldValue('Message');
     
    const label_id = block.getFieldValue("Id");
    const value_question = {
        typed: [
            text_message
        ]
    };
    const statements_truestep = statementToArray(JsonBotDefinition.statementToCode(block, 'TrueStep'));
    const statements_falsestep = statementToArray(JsonBotDefinition.statementToCode(block, 'FalseStep'));

    addStepsToLater(statements_truestep.concat(statements_falsestep));

    const confirmStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ConfirmStep, Carubbi.BotEditor.Config",
        id: label_id,
        question: value_question,
        trueStepId: (statements_truestep.length > 0 && statements_truestep[0].id) || null,
        falseStepId: (statements_falsestep.length > 0 && statements_falsestep[0].id) || null,
    };
    console.log(confirmStep);
    const code = JSON.stringify(confirmStep);
    return code;
};
  
  JsonBotDefinition['simpleliststep'] = function(block) {
    const text_message = block.getFieldValue('Message');
    const label_id = block.getFieldValue("Id");
    const value_promptmessage = {
        typed: [
            text_message
        ]
    };

    const statements_input = statementToArray(JsonBotDefinition.statementToCode(block, 'Input'));

    const nextBlock = block.getNextBlock();

    const listStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ListStep, Carubbi.BotEditor.Config",
        id: label_id,
        listType: 'ButtonList',
        promptMessage: value_promptmessage,
        input: statements_input,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    const code = JSON.stringify(listStep);
    return code;
    

  };
  
  JsonBotDefinition['simplelistitem'] = function(block) {
    
    if (block.isShadow_) return null;
    
    const text_title = block.getFieldValue('Title');
    const statements_targetstep = statementToArray(JsonBotDefinition.statementToCode(block, 'TargetStep'));

    addStepsToLater(statements_targetstep);

    const listItem = {
        title: text_title,
        buttonValue: text_title,
        action: 'NavigateStep',
        targetStepId: statements_targetstep.length > 0 ? statements_targetstep[0].id : null
    };

    const code = JSON.stringify(listItem);
    return code;

  };

export default JsonBotDefinition;