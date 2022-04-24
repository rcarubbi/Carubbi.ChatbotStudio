Blockly.JsonBotDefinition = new Blockly.Generator('JsonBotDefinition');
Blockly.JsonBotDefinition.ORDER_NONE = 99;
Blockly.JsonBotDefinition.ORDER_ATOMIC = 0;
Blockly.JsonBotDefinition.ORDER_STRING = 1;

var stepsToAddLater = {};
var _currentScope = "botconfig";

var relationalOperators = {
    "Equals": "=",
    "Greater": ">",
    "Less": "<",
    "GreaterOrEquals": ">=",
    "LessOrEquals": "<=",
    "NotEquals": "<>",
};

var logicalOperators = {
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
    return (formCustomMessages && formCustomMessages.filter(x => x.key.toLowerCase() === key.toLowerCase()).map(x => x.value) || null);
}

function getFormCustomMessageValue(formCustomMessages, key) {
    return (formCustomMessages && formCustomMessages.filter(x => x.key.toLowerCase() === key.toLowerCase())[0] || null);
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

Blockly.JsonBotDefinition.fromWorkspace = function (workspace) {

    _currentScope = 'botconfig';
    stepsToAddLater = {};

    var top_blocks = workspace.getTopBlocks(false);
    for (var i in top_blocks) {
        var top_block = top_blocks[i];
        if (top_block.type === 'botconfig')
            return this.generalBlockToObj(top_block, workspace);
    }

};

Blockly.JsonBotDefinition.generalBlockToObj = function (block, workspace) {

    if (block && !block.isShadow_) {

        // dispatcher:
        var func = this[block.type];
        if (func) {
            return func.call(this, block, workspace);
        } else {
            console.log("Don't know how to generate JSON code for a '" + block.type + "'");
        }
    } else {
        return null;
    }
};

Blockly.JsonBotDefinition.scrub_ = function (block, code, opt_thisOnly) {

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
        var nextCode = Blockly.JsonBotDefinition.blockToCode(nextBlock);
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

Blockly.JsonBotDefinition['botconfig'] = function (block, workspace) {
    var text_name = block.getFieldValue('Name');
    var statements_steps = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Steps'));
    var steps = statements_steps.filter(s => s.$type);
    if (stepsToAddLater['botconfig'] && stepsToAddLater['botconfig'].steps.filter(s => s.$type)) {
        steps = steps.concat(stepsToAddLater['botconfig'].steps.filter(s => s.$type));
    }

    var statements_customcommands = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'CustomCommands'));
    var value_speechsettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'SpeechSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_appcredentials = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'AppCredentials', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_storesettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'StoreSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));

    var botJson = {
        id: workspace.id,
        name: text_name,
        rootStepId: (statements_steps.length > 0 && statements_steps[0].id) || null,
        steps,
        customCommands: statements_customcommands,
        speechSettings: typeof value_speechsettings === "object" ? value_speechsettings : null,
        appId: (value_appcredentials && value_appcredentials.appId) || null,
        appPassword: (value_appcredentials && value_appcredentials.appPassword) || null,
        persistenceStrategy: (value_storesettings && value_storesettings.persistenceStrategy) || null,
        connectionString: (value_storesettings && value_storesettings.connectionString) || null
    };

    var code = JSON.stringify(botJson);
    return code.replace(/\\\\r/g, "\\r").replace(/\\\\n/g, "\\n");
};

Blockly.JsonBotDefinition['messagestep'] = function (block) {
    var label_id = block.getFieldValue("Id");
    var value_messages = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Messages', Blockly.JsonBotDefinition.ORDER_ATOMIC));
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

Blockly.JsonBotDefinition['inputstep'] = function (block) {
    var label_id = block.getFieldValue("Id");
    var value_question = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Question', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var value_nlpsettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'NLPSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_textanalysissettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'TextAnalysisSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));
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

Blockly.JsonBotDefinition['string'] = function (block) {
    if (block.isShadow_) return null;
    var text_value = block.getFieldValue('Value');
    var code = text_value;
    return code;
};

Blockly.JsonBotDefinition['nlpsettings'] = function (block) {
    if (block.isShadow_) return null;

    var dropdown_nlpservicetype = block.getFieldValue('NlpServiceType');
    var statements_models = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Models'));

    var nlpSettings = {
        serviceType: dropdown_nlpservicetype,
        models: statements_models
    };

    var code = JSON.stringify(nlpSettings);

    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['textanalysissettings'] = function (block) {
    if (block.isShadow_) return null;

    var dropdown_textanalysisservicetype = block.getFieldValue('TextAnalysisServiceType');
    var dropdown_language = block.getFieldValue('Language');
    var text_subscriptionkey = block.getFieldValue('SubscriptionKey');
    var text_endpoint = block.getFieldValue('Endpoint');

    var textAnalysisSettings = {
        serviceType: dropdown_textanalysisservicetype,
        language: dropdown_language,
        subscriptionKey: text_subscriptionkey,
        endpoint: text_endpoint,
    };

    var code = JSON.stringify(textAnalysisSettings);

    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['nlpmodel'] = function (block) {
    if (block.isShadow_) return null;

    var text_appid = block.getFieldValue('AppId');
    var text_predictionkey = block.getFieldValue('PredictionKey');
    var text_predictionendpoint = block.getFieldValue('PredictionEndpoint');

    var nlpModel = {
        appId: text_appid,
        endpointPredictionKey: text_predictionkey,
        endpoint: text_predictionendpoint
    };

    var code = JSON.stringify(nlpModel);
    return code;
};

Blockly.JsonBotDefinition['confirmstep'] = function (block) {
    var label_id = block.getFieldValue("Id");
    var value_question = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Question', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_retrymessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'RetryMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_toomanyattemptsmessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var text_yestext = block.getFieldValue('YesText');
    var text_notext = block.getFieldValue('NoText');
    var statements_yesacceptedanswers = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'YesAcceptedAnswers'));
    var statements_noacceptedanswers = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'NoAcceptedAnswers'));
    var number_attempts = block.getFieldValue('Attempts');
    var statements_truestep = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'TrueStep'));
    var statements_falsestep = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'FalseStep'));

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

    var code = JSON.stringify(confirmStep);
    return code;
};

Blockly.JsonBotDefinition['messageinteractions'] = function (block) {
    if (block.isShadow_) return null;

    var statements_typed = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Typed'));
    var statements_spoken = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Spoken'));
    var statements_imageurls = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'ImageUrls'));


    var messageInteractions = {
        typed: statements_typed,
        spoken: statements_spoken,
        imageUrls: statements_imageurls,
    };
    var code = JSON.stringify(messageInteractions);
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
}; 

Blockly.JsonBotDefinition['liststep'] = function (block) {
    var label_id = block.getFieldValue("Id");
    var dropdown_listtype = block.getFieldValue('ListType');
    var value_promptmessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'PromptMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var statements_input = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Input'));
    var value_retrymessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'RetryMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_toomanyattemptsmessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var number_attempts = block.getFieldValue('Attempts');
    var value_nlpsettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'NLPSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_datasourceexpression = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'DataSourceExpression', Blockly.JsonBotDefinition.ORDER_ATOMIC));

    var nextBlock = block.getNextBlock();

    var listStep = {
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
        dataSourceExpresssion: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null
    };

    var code = JSON.stringify(listStep);
    return code;
};



Blockly.JsonBotDefinition['customcommandconfig'] = function (block) {
    if (block.isShadow_) return null;

    var text_commandtext = block.getFieldValue('CommandText');
    var checkbox_startup = block.getFieldValue('Startup') == 'TRUE';
    var checkbox_cleardialogstack = block.getFieldValue('ClearDialogStack') == 'TRUE';
    var checkbox_deleteprofile = block.getFieldValue('DeleteProfile') == 'TRUE';
    var checkbox_invalidatecache = block.getFieldValue('InvalidateCache') == 'TRUE';
    var text_custommessagereply = block.getFieldValue('CustomMessageReply');

    var customCommandConfig = {
        commandText: text_commandtext,
        startup: checkbox_startup,
        clearDialogStack: checkbox_cleardialogstack,
        deleteProfile: checkbox_deleteprofile,
        invalidateCache: checkbox_invalidatecache,
        customMessageReply: text_custommessagereply
    };
    var code = JSON.stringify(customCommandConfig);
    return code;
};



Blockly.JsonBotDefinition['speechsettings'] = function (block) {
    if (block.isShadow_) return null;

    var dropdown_language = block.getFieldValue('Language');
    var dropdown_recognitionservicetype = block.getFieldValue('RecognitionServiceType');
    var dropdown_recognitionserviceregion = block.getFieldValue('RecognitionServiceRegion');
    var text_recognitionsubscriptionkey = block.getFieldValue('RecognitionSubscriptionKey');
    var dropdown_synthesisservicetype = block.getFieldValue('SynthesisServiceType');
    var dropdown_synthesisserviceregion = block.getFieldValue('SynthesisServiceRegion');
    var text_synthesissubscriptionkey = block.getFieldValue('SynthesisSubscriptionKey');
    var text_voicename = block.getFieldValue('VoiceName');
    var dropdown_cachetype = block.getFieldValue('CacheType');
    var dropdown_storetype = block.getFieldValue('StoreType');

    var speechSettings = {
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

    var code = JSON.stringify(speechSettings);
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};


Blockly.JsonBotDefinition['appcredentials'] = function (block) {
    if (block.isShadow_) return null;

    var text_appid = block.getFieldValue('AppId');
    var text_apppassword = block.getFieldValue('AppPassword');

    var appCredentials = {
        appId: text_appid,
        appPassword: text_apppassword
    };

    var code = JSON.stringify(appCredentials);
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['storesettings'] = function (block) {
    var dropdown_persistencestrategy = block.getFieldValue('PersistenceStrategy');
    var text_connectionstring = block.getFieldValue('ConnectionString');

    var storeSettings = {
        persistenceStrategy: dropdown_persistencestrategy,
        connectionString: text_connectionstring
    };
    var code = JSON.stringify(storeSettings);
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};



Blockly.JsonBotDefinition['formstep'] = function (block) {
    var label_id = block.getFieldValue("Id");
    var statements_formfields = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'FormFields'));
    var value_summary = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Summary', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var statements_formcustommessages = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'FormCustomMessages'));
    var statements_formcustomcommands = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'FormCustomCommands'));
    var value_nlpsettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'NlpSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));

    var nextBlock = block.getNextBlock();
    var helpCommand = getFormCustomComnand(statements_formcustomcommands, "help");
    var backupCommand = getFormCustomComnand(statements_formcustomcommands, "backup");
    var resetCommand = getFormCustomComnand(statements_formcustomcommands, "reset");
    var quitCommand = getFormCustomComnand(statements_formcustomcommands, "quit");
    var statusCommand = getFormCustomComnand(statements_formcustomcommands, "status");
    var formFieldId = 1;

    var formStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.FormStep, Carubbi.BotEditor.Config',
        version: 0,
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        formFields: statements_formfields.map(ff => Object.assign(ff, { id: formFieldId++ })),
        durable: checkbox_durable,
        showSummary: value_summary ? true : false,
        summaryText: (value_summary && value_summary.summaryText) || null,
        includeFieldsOnSummary: (value_summary && value_summary.includeFieldsOnSummary) || null,
        includeConfirmatioButtonsOnSummary: (value_summary && value_summary.includeConfirmatioButtonsOnSummary) || null,
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

Blockly.JsonBotDefinition['formfield'] = function (block) {
    if (block.isShadow_) return null;

    var text_name = block.getFieldValue('Name');
    var text_question = block.getFieldValue('Question');
    var checkbox_optional = block.getFieldValue('Optional') == 'TRUE';
    var dropdown_type = block.getFieldValue('Type');
    var text_nlpentityname = block.getFieldValue('NlpEntityName');
    var text_validationapiurl = block.getFieldValue('ValidationApiURL');
    var text_validationfailedmessage = block.getFieldValue('ValidationFailedMessage');
    var text_activeapiurl = block.getFieldValue('ActiveApiURL');

    var formField = {
        name: text_name,
        question: text_question,
        optional: checkbox_optional,
        type: dropdown_type,
        nlpentityName: text_nlpentityname,
        validationApiUrl: text_validationapiurl,
        validationFailedMessage: text_validationfailedmessage,
        activeApiUrl: text_activeapiurl,
    };

    var code = JSON.stringify(formField);
    return code;
};

Blockly.JsonBotDefinition['optionsformfield'] = function (block) {
    if (block.isShadow_) return null;

    var text_name = block.getFieldValue('Name');
    var text_question = block.getFieldValue('Question');
    var checkbox_optional = block.getFieldValue('Optional') == 'TRUE';
    var dropdown_type = block.getFieldValue('Type');
    var statements_options = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Options'));
    var text_nlpentityname = block.getFieldValue('NlpEntityName');
    var text_validationapiurl = block.getFieldValue('ValidationApiURL');
    var text_validationfailedmessage = block.getFieldValue('ValidationFailedMessage');
    var text_activeapiurl = block.getFieldValue('ActiveApiURL');
    var optionsSource = (statements_options && statements_options[0] && statements_options[0].optionsSource) || null;

    var optionsFormField = {
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

    var code = JSON.stringify(optionsFormField);

    return code;
};

Blockly.JsonBotDefinition['fieldoption'] = function (block) {
    if (block.isShadow_) return null;

    var text_value = block.getFieldValue('Value');
    var text_description = block.getFieldValue('Description');

    var fieldOption = {
        value: text_value,
        description: text_description
    };

    var code = JSON.stringify(fieldOption);
    return code;
};

Blockly.JsonBotDefinition['fieldoptionsource'] = function (block) {
    if (block.isShadow_) return null;

    var text_optionssource = block.getFieldValue('OptionsSource');

    var fieldOptionSource = {
        optionsSource: text_optionssource,
    };

    var code = JSON.stringify(fieldOptionSource);
    return code;
};

Blockly.JsonBotDefinition['restoreformfield'] = function (block) {
    if (block.isShadow_) return null;

    var text_name = block.getFieldValue('Name');
    var text_question = block.getFieldValue('Question');
    var statements_restorefields = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'RestoreFields'));

    var formField = {
        name: text_name,
        question: text_question,
        restoreFields: statements_restorefields
    };

    var code = JSON.stringify(formField);

    return code;
};

Blockly.JsonBotDefinition['summary'] = function (block) {
    if (block.isShadow_) return null;

    var text_summarytext = block.getFieldValue('SummaryText');
    var checkbox_includefieldlistonsummary = block.getFieldValue('IncludeFieldListOnSummary') == 'TRUE';
    var checkbox_includeconfirmationbuttonsonsummary = block.getFieldValue('IncludeConfirmationButtonsOnSummary') == 'TRUE';

    var summary = {
        summaryText: text_summarytext,
        includeFieldsOnSummary: checkbox_includefieldlistonsummary,
        includeConfirmatioButtonsOnSummary: checkbox_includeconfirmationbuttonsonsummary
    };

    var code = JSON.stringify(summary);
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['formcustommessage'] = function (block) {
    if (block.isShadow_) return null;

    var dropdown_key = block.getFieldValue('Key');
    var text_value = block.getFieldValue('Value');

    var formCustomMessage = {
        key: dropdown_key,
        value: text_value
    };

    var code = JSON.stringify(formCustomMessage);
    return code;
};


Blockly.JsonBotDefinition['formcustomcommand'] = function (block) {
    if (block.isShadow_) return null;

    var dropdown_commandtype = block.getFieldValue('CommandType');
    var text_description = block.getFieldValue('Description');
    var text_terms = block.getFieldValue('Terms');
    var text_helpmessage = block.getFieldValue('HelpMessage');

    var formCustomCommand = {
        commandType: dropdown_commandtype,
        description: text_description,
        terms: text_terms,
        helpMessage: text_helpmessage
    };

    var code = JSON.stringify(formCustomCommand);
    return code;
};

Blockly.JsonBotDefinition['datasource'] = function (block) {
    if (block.isShadow_) return null;

    var number_stepid = block.getFieldValue('StepId');
    var text_expression = block.getFieldValue('Expression');

    var dataSource = {
        stepId: number_stepid,
        expression: text_expression
    };

    var code = JSON.stringify(dataSource);

    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['conditionstep'] = function (block) {
    var label_id = block.getFieldValue("Id");
    var value_conditionexpression = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'ConditionExpression', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var statements_truestep = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'TrueStep'));
    var statements_falsestep = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'FalseStep'));
    var value_datasourceexpression = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'DataSourceExpression', Blockly.JsonBotDefinition.ORDER_ATOMIC));

    addStepsToLater(statements_truestep.concat(statements_falsestep));

    var conditionStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ConditionStep, Carubbi.BotEditor.Config",
        id: label_id,
        conditionExpression: value_conditionexpression,
        dataSourceExpresssion: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null,
        trueStepId: (statements_truestep.length > 0 && statements_truestep[0].id) || null,
        falseStepId: (statements_falsestep.length > 0 && statements_falsestep[0].id) || null,
    };

    var code = JSON.stringify(conditionStep);
    return code;
};

Blockly.JsonBotDefinition['relationalexpression'] = function (block) {
    if (block.isShadow_) return null;

    var value_left = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Left', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var dropdown_operator = block.getFieldValue('Operator');
    var value_right = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Right', Blockly.JsonBotDefinition.ORDER_ATOMIC));

    var code = `(${value_left} ${getRelationalOperator(dropdown_operator)} ${value_right})`;
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['binarylogicalexpression'] = function (block) {
    if (block.isShadow_) return null;

    var value_left = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Left', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var dropdown_operator = block.getFieldValue('Operator');
    var value_right = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Right', Blockly.JsonBotDefinition.ORDER_ATOMIC));

    var code = `(${value_left} ${getLogicalOperator(dropdown_operator)} ${value_right})`;

    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['unarylogicalexpression'] = function (block) {
    if (block.isShadow_) return null;

    var value_left = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'Left', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var code = `(!${value_left})`
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['stepexpression'] = function (block) {
    if (block.isShadow_) return null;

    var text_expression = block.getFieldValue('Expression');
    var number_stepid = block.getFieldValue('StepId');

    var code = `@${number_stepid}.${text_expression}`;

    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['literal'] = function (block) {
    if (block.isShadow_) return null;

    var text_value = block.getFieldValue('Value');
    var code = text_value;
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};


Blockly.JsonBotDefinition['navigatelistitem'] = function (block) {
    if (block.isShadow_) return null;
    var text_title = block.getFieldValue('Title');
    var text_subtitle = block.getFieldValue('SubTitle');
    var text_imageurl = block.getFieldValue('ImageUrl');
    var text_buttontitle = block.getFieldValue('ButtonTitle');
    var text_buttonvalue = block.getFieldValue('ButtonValue');
    var statements_targetstep = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'TargetStep'));

    addStepsToLater(statements_targetstep);

    var listItem = {
        title: text_title,
        subtitle: text_subtitle,
        imageUrl: text_imageurl,
        buttonTitle: text_buttontitle,
        buttonValue: text_buttonvalue,
        action: 'NavigateStep',
        targetStepId: statements_targetstep.length > 0 ? statements_targetstep[0].id : null
    };

    var code = JSON.stringify(listItem);
    return code;
};

Blockly.JsonBotDefinition['openurllistitem'] = function (block) {
    if (block.isShadow_) return null;
    var text_title = block.getFieldValue('Title');
    var text_subtitle = block.getFieldValue('SubTitle');
    var text_imageurl = block.getFieldValue('ImageUrl');
    var text_buttontitle = block.getFieldValue('ButtonTitle');
    var text_buttonvalue = block.getFieldValue('ButtonValue');

    var listItem = {
        title: text_title,
        subtitle: text_subtitle,
        imageUrl: text_imageurl,
        buttonTitle: text_buttontitle,
        buttonValue: text_buttonvalue,
        action: 'OpenURL',
    };

    var code = JSON.stringify(listItem);
    return code;
};

Blockly.JsonBotDefinition['downloadfilelistitem'] = function (block) {
    if (block.isShadow_) return null;
    var text_title = block.getFieldValue('Title');
    var text_subtitle = block.getFieldValue('SubTitle');
    var text_imageurl = block.getFieldValue('ImageUrl');
    var text_buttontitle = block.getFieldValue('ButtonTitle');
    var text_buttonvalue = block.getFieldValue('ButtonValue');

    var listItem = {
        title: text_title,
        subtitle: text_subtitle,
        imageUrl: text_imageurl,
        buttonTitle: text_buttontitle,
        buttonValue: text_buttonvalue,
        action: 'DownloadFile',
    };

    var code = JSON.stringify(listItem);
    return code;
};


Blockly.JsonBotDefinition['apistep'] = function (block) {
    var label_id = block.getFieldValue("Id");
    var dropdown_verb = block.getFieldValue('Verb');
    var text_apiurl = block.getFieldValue('ApiURL');
    var text_resource = block.getFieldValue('Resource');
    var statements_parameters = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Parameters'));
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var value_datasourceexpression = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'DataSourceExpression', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var nextBlock = block.getNextBlock();

    var apiStep = {
        $type: "Carubbi.BotEditor.Config.Steps.ApiStep, Carubbi.BotEditor.Config",
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        verb: dropdown_verb,
        apiUrl: text_apiurl,
        resource: text_resource,
        parameters: statements_parameters,
        durable: checkbox_durable,
        dataSourceExpresssion: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null
    };

    var code = JSON.stringify(apiStep);
    return code;
};

Blockly.JsonBotDefinition['apiparameter'] = function (block) {
    var text_name = block.getFieldValue('Name');
    var text_value = block.getFieldValue('Value');
    var dropdown_type = block.getFieldValue('Type');

    var apiParameter = {
        name: text_name,
        value: text_value,
        type: dropdown_type
    };

    var code = JSON.stringify(apiParameter);
    return code;
};


Blockly.JsonBotDefinition['goto'] = function (block) {
    var number_id = block.getFieldValue('Id');
    var code = JSON.stringify({ id: number_id });
    return code;
};

Blockly.JsonBotDefinition['compositestep'] = function (block) {
    var parentScope = _currentScope;
    var nextBlock = block.getNextBlock();
    var label_id = block.getFieldValue('Id');
    var text_name = block.getFieldValue('Name');
    _currentScope = text_name;

    var statements_steps = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Steps'));

    var steps = statements_steps.filter(s => s.$type);
    if (stepsToAddLater[_currentScope] && stepsToAddLater[_currentScope].steps.filter(s => s.$type)) {
        steps = steps.concat(stepsToAddLater[_currentScope].steps.filter(s => s.$type));
    }

    var compositeStep = {
        $type: "Carubbi.BotEditor.Config.Steps.CompositeStep, Carubbi.BotEditor.Config",
        id: label_id,
        name: text_name,
        steps: steps,
        rootStepId: (statements_steps.length > 0 && statements_steps[0].id) || null,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
    };

    _currentScope = parentScope;

    var code = JSON.stringify(compositeStep);
    return code;
};

Blockly.JsonBotDefinition['faqstep'] = function (block) {
    var label_id = block.getFieldValue('Id');
    var value_askquestionmessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'AskQuestionMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var number_minimumscore = block.getFieldValue('MinimumScore');
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var value_faqsettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'FaqSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var nextBlock = block.getNextBlock();

    var faqStep = {
        $type: "Carubbi.BotEditor.Config.Steps.FaqStep, Carubbi.BotEditor.Config",
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        askQuestionMessage: value_askquestionmessage,
        minimumScore: number_minimumscore,
        durable: checkbox_durable,
        faqSettings: value_faqsettings,
    };

    var code = JSON.stringify(faqStep);
    return code;
};

Blockly.JsonBotDefinition['faqsettings'] = function (block) {
    var dropdown_servicetype = block.getFieldValue('ServiceType');
    var text_knowledgebaseid = block.getFieldValue('KnowledgeBaseId');
    var text_endpointkey = block.getFieldValue('EndpointKey');
    var text_endpoint = block.getFieldValue('Endpoint');
    var number_maxanswers = block.getFieldValue('MaxAnswers');

    var faqSettings = {
        serviceType: dropdown_servicetype,
        knowledgeBaseId: text_knowledgebaseid,
        endpointKey: text_endpointkey,
        endpoint: text_endpoint,
        maxAnswers: number_maxanswers
    };
    var code = JSON.stringify(faqSettings);

    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['mapsstep'] = function (block) {
    var dropdown_servicetype = block.getFieldValue('ServiceType');
    var label_id = block.getFieldValue('Id');
    var statements_input = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Input'));
    var checkbox_selectable = block.getFieldValue('Selectable') == 'TRUE';
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var value_datasourceexpression = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'DataSourceExpression', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var nextBlock = block.getNextBlock();

    var mapsStep = {
        $type: "Carubbi.BotEditor.Config.Steps.MapsStep, Carubbi.BotEditor.Config",
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        selectable: checkbox_selectable,
        durable: checkbox_durable,
        dataSourceExpresssion: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null,
        input: statements_input,
        serviceType: dropdown_servicetype
    };

    var code = JSON.stringify(mapsStep);
    return code;
};

Blockly.JsonBotDefinition['locationsource'] = function (block) {

    var text_name = block.getFieldValue('Name');
    var text_latitude = block.getFieldValue('Latitude');
    var text_longitude = block.getFieldValue('Longitude');
    var text_zipcode = block.getFieldValue('ZipCode');
    var text_address = block.getFieldValue('Address');
    var text_state = block.getFieldValue('State');
    var text_city = block.getFieldValue('City');

    var locationSource = {
        name: text_name,
        latitude: text_latitude,
        longitude: text_longitude,
        zipCode: text_zipcode,
        address: text_address,
        state: text_state,
        city: text_city
    };

    var code = JSON.stringify(locationSource);
    return code;
};

Blockly.JsonBotDefinition['switchstep'] = function (block) {
    var text_input = block.getFieldValue('Input');
    var statements_cases = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Cases'));
    var value_datasourceexpression = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'DataSourceExpression', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var label_id = block.getFieldValue("Id");

    var switchStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.SwitchStep, Carubbi.BotEditor.Config',
        id: label_id,
        input: text_input,
        cases: statements_cases,
        dataSourceExpresssion: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null
    };

    var code = JSON.stringify(switchStep);
    return code;
};

Blockly.JsonBotDefinition['case'] = function (block) {
    var text_value = block.getFieldValue('Value');
    var statements_targetstep = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'TargetStep'));

    addStepsToLater(statements_targetstep);

    var $case = {
        value: text_value,
        targetStepId: statements_targetstep.length > 0 ? statements_targetstep[0].id : null
    };

    var code = JSON.stringify($case);
    return code;
};

Blockly.JsonBotDefinition['imageclassificationstep'] = function (block) {
    var value_askimagemessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'AskImageMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_retrymessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'RetryMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_toomanyattemptsmessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var number_attempts = block.getFieldValue('Attempts');
    var number_maxresults = block.getFieldValue('MaxResults');
    var number_minscore = block.getFieldValue('MinScore');
    var number_errorstepid = block.getFieldValue('ErrorStepId');
    var value_imageclassificationsettings = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'ImageClassificationSettings', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var label_id = block.getFieldValue("Id");
    var nextBlock = block.getNextBlock();

    var imageClassificationStep = {
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

    var code = JSON.stringify(imageClassificationStep);
    return code;
};

Blockly.JsonBotDefinition['imageclassificationsettings'] = function (block) {
    var dropdown_servicetype = block.getFieldValue('ServiceType');
    var text_projectid = block.getFieldValue('ProjectId');
    var text_predictionendpoint = block.getFieldValue('PredictionEndpoint');
    var text_predictionkey = block.getFieldValue('PredictionKey');
    var text_trainingendpoint = block.getFieldValue('TrainingEndpoint');
    var text_trainingkey = block.getFieldValue('TrainingKey');

    var imageClassificationSettings = {
        serviceType: dropdown_servicetype,
        projectId: text_projectid,
        predictionEndpoint: text_predictionendpoint,
        predictionKey: text_predictionkey,
        trainingEndpoint: text_trainingendpoint,
        trainingKey: text_trainingkey,
    };

    var code = JSON.stringify(imageClassificationSettings);
    return [code, Blockly.JsonBotDefinition.ORDER_NONE];
};

Blockly.JsonBotDefinition['readgpslocationstep'] = function (block) {
    var value_asklocationmessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'AskLocationMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_retrymessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'RetryMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var value_toomanyattemptsmessage = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
    var number_attempts = block.getFieldValue('Attempts');
    var number_errorstepid = block.getFieldValue('ErrorStepId');
    var nextBlock = block.getNextBlock();
    var label_id = block.getFieldValue("Id");

    var readGpsLocationStep = {
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

    var code = JSON.stringify(readGpsLocationStep);
    return code;
};

Blockly.JsonBotDefinition['transformstep'] = function (block) {
    var text_propertypath = block.getFieldValue('PropertyPath');
    var statements_transformations = statementToArray(Blockly.JsonBotDefinition.statementToCode(block, 'Transformations'));
    var value_datasourceexpression = parseValue(Blockly.JsonBotDefinition.valueToCode(block, 'DataSourceExpression', Blockly.JsonBotDefinition.ORDER_ATOMIC));
    var nextBlock = block.getNextBlock();
    var label_id = block.getFieldValue("Id");

    var transformStep = {
        $type: 'Carubbi.BotEditor.Config.Steps.TransformStep, Carubbi.BotEditor.Config',
        id: label_id,
        nextStepId: (nextBlock && nextBlock.getFieldValue("Id")) || null,
        propertyPath: text_propertypath,
        transformations: statements_transformations,
        dataSourceExpresssion: (value_datasourceexpression && `@${value_datasourceexpression.stepId}.${value_datasourceexpression.expression}`) || null
    };

    var code = JSON.stringify(transformStep);

    return code;
};

Blockly.JsonBotDefinition['transformation'] = function (block) {
    var text_inputexpression = block.getFieldValue('InputExpression');
    var text_outputexpression = block.getFieldValue('OutputExpression');

    var transformation = {
        inputExpression: text_inputexpression,
        outputExpression: text_outputexpression,
    };

    var code = JSON.stringify(transformation);

    return code;
};