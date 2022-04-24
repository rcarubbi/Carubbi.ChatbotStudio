Blockly.JavaScript['botconfig'] = function(block) {
  var text_name = block.getFieldValue('Name');
  var statements_steps = Blockly.JavaScript.statementToCode(block, 'Steps');
  var statements_customcommands = Blockly.JavaScript.statementToCode(block, 'CustomCommands');
  var value_speechsettings = Blockly.JavaScript.valueToCode(block, 'SpeechSettings', Blockly.JavaScript.ORDER_ATOMIC);
  var value_appcredentials = Blockly.JavaScript.valueToCode(block, 'AppCredentials', Blockly.JavaScript.ORDER_ATOMIC);
  var value_storesettings = Blockly.JavaScript.valueToCode(block, 'StoreSettings', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['messagestep'] = function(block) {
  var value_messages = Blockly.JavaScript.valueToCode(block, 'Messages', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['inputstep'] = function(block) {
  var value_question = Blockly.JavaScript.valueToCode(block, 'Question', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var value_nlpsettings = Blockly.JavaScript.valueToCode(block, 'NLPSettings', Blockly.JavaScript.ORDER_ATOMIC);
  var value_textanalysissettings = Blockly.JavaScript.valueToCode(block, 'TextAnalysisSettings', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['string'] = function(block) {
  var text_value = block.getFieldValue('Value');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['nlpsettings'] = function(block) {
  var dropdown_nlpservicetype = block.getFieldValue('NlpServiceType');
  var statements_models = Blockly.JavaScript.statementToCode(block, 'Models');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['textanalysissettings'] = function(block) {
  var dropdown_textanalysisservicetype = block.getFieldValue('TextAnalysisServiceType');
  var dropdown_language = block.getFieldValue('Language');
  var text_subscriptionkey = block.getFieldValue('SubscriptionKey');
  var text_endpoint = block.getFieldValue('Endpoint');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['nlpmodel'] = function(block) {
  var text_appid = block.getFieldValue('AppId');
  var text_predictionkey = block.getFieldValue('PredictionKey');
  var text_predictionendpoint = block.getFieldValue('PredictionEndpoint');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['confirmstep'] = function(block) {
  var value_question = Blockly.JavaScript.valueToCode(block, 'Question', Blockly.JavaScript.ORDER_ATOMIC);
  var value_retrymessage = Blockly.JavaScript.valueToCode(block, 'RetryMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var value_toomanyattemptsmessage = Blockly.JavaScript.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var text_yestext = block.getFieldValue('YesText');
  var text_notext = block.getFieldValue('NoText');
  var statements_yesacceptedanswers = Blockly.JavaScript.statementToCode(block, 'YesAcceptedAnswers');
  var statements_noacceptedanswers = Blockly.JavaScript.statementToCode(block, 'NoAcceptedAnswers');
  var number_attempts = block.getFieldValue('Attempts');
  var statements_truestep = Blockly.JavaScript.statementToCode(block, 'TrueStep');
  var statements_falsestep = Blockly.JavaScript.statementToCode(block, 'FalseStep');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['messageinteractions'] = function(block) {
  var statements_typed = Blockly.JavaScript.statementToCode(block, 'Typed');
  var statements_spoken = Blockly.JavaScript.statementToCode(block, 'Spoken');
  var statements_files = Blockly.JavaScript.statementToCode(block, 'Files');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['liststep'] = function(block) {
  var dropdown_listtype = block.getFieldValue('ListType');
  var value_promptmessage = Blockly.JavaScript.valueToCode(block, 'PromptMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_input = Blockly.JavaScript.statementToCode(block, 'Input');
  var value_retrymessage = Blockly.JavaScript.valueToCode(block, 'RetryMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var value_toomanyattemptsmessage = Blockly.JavaScript.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var number_attempts = block.getFieldValue('Attempts');
  var value_nlpsettings = Blockly.JavaScript.valueToCode(block, 'NLPSettings', Blockly.JavaScript.ORDER_ATOMIC);
  var value_datasource = Blockly.JavaScript.valueToCode(block, 'DataSource', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['customcommandconfig'] = function(block) {
  var text_commandtext = block.getFieldValue('CommandText');
  var checkbox_startup = block.getFieldValue('Startup') == 'TRUE';
  var checkbox_cleardialogstack = block.getFieldValue('ClearDialogStack') == 'TRUE';
  var checkbox_deleteprofile = block.getFieldValue('DeleteProfile') == 'TRUE';
  var checkbox_invalidatecache = block.getFieldValue('InvalidateCache') == 'TRUE';
  var text_custommessagereply = block.getFieldValue('CustomMessageReply');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['speechsettings'] = function(block) {
  var dropdown_language = block.getFieldValue('Language');
  var dropdown_recognitionservicetype = block.getFieldValue('RecognitionServiceType');
  var dropdown_recognitionserviceregion = block.getFieldValue('RecognitionServiceRegion');
  var text_recognitionsubscriptionkey = block.getFieldValue('RecognitionSubscriptionKey');
  var text_voicename = block.getFieldValue('VoiceName');
  var dropdown_synthesisservicetype = block.getFieldValue('SynthesisServiceType');
  var dropdown_synthesisserviceregion = block.getFieldValue('SynthesisServiceRegion');
  var text_synthesissubscriptionkey = block.getFieldValue('SynthesisSubscriptionKey');
  var dropdown_cachetype = block.getFieldValue('CacheType');
  var dropdown_storetype = block.getFieldValue('StoreType');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['appcredentials'] = function(block) {
  var text_appid = block.getFieldValue('AppId');
  var text_apppassword = block.getFieldValue('AppPassword');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['storesettings'] = function(block) {
  var dropdown_persistencestrategy = block.getFieldValue('PersistenceStrategy');
  var text_connectionstring = block.getFieldValue('ConnectionString');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['formstep'] = function(block) {
  var statements_formfields = Blockly.JavaScript.statementToCode(block, 'FormFields');
  var value_summary = Blockly.JavaScript.valueToCode(block, 'Summary', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var statements_formcustommessages = Blockly.JavaScript.statementToCode(block, 'FormCustomMessages');
  var statements_formcustomcommands = Blockly.JavaScript.statementToCode(block, 'FormCustomCommands');
  var value_nlpsettings = Blockly.JavaScript.valueToCode(block, 'NlpSettings', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['formfield'] = function(block) {
  var text_name = block.getFieldValue('Name');
  var text_question = block.getFieldValue('Question');
  var checkbox_optional = block.getFieldValue('Optional') == 'TRUE';
  var dropdown_type = block.getFieldValue('Type');
  var text_nlpentityname = block.getFieldValue('NlpEntityName');
  var text_validationapiurl = block.getFieldValue('ValidationApiURL');
  var text_validationfailedmessage = block.getFieldValue('ValidationFailedMessage');
  var text_activeapiurl = block.getFieldValue('ActiveApiURL');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['optionsformfield'] = function(block) {
  var text_name = block.getFieldValue('Name');
  var text_question = block.getFieldValue('Question');
  var checkbox_optional = block.getFieldValue('Optional') == 'TRUE';
  var dropdown_type = block.getFieldValue('Type');
  var statements_options = Blockly.JavaScript.statementToCode(block, 'Options');
  var text_nlpentityname = block.getFieldValue('NlpEntityName');
  var text_validationapiurl = block.getFieldValue('ValidationApiURL');
  var text_validationfailedmessage = block.getFieldValue('ValidationFailedMessage');
  var text_activeapiurl = block.getFieldValue('ActiveApiURL');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['fieldoption'] = function(block) {
  var text_value = block.getFieldValue('Value');
  var text_description = block.getFieldValue('Description');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['fieldoptionsource'] = function(block) {
  var text_optionssource = block.getFieldValue('OptionsSource');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['restoreformfield'] = function(block) {
  var text_name = block.getFieldValue('Name');
  var text_question = block.getFieldValue('Question');
  var statements_restorefields = Blockly.JavaScript.statementToCode(block, 'RestoreFields');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['summary'] = function(block) {
  var text_summarytext = block.getFieldValue('SummaryText');
  var checkbox_includefieldlistonsummary = block.getFieldValue('IncludeFieldListOnSummary') == 'TRUE';
  var checkbox_includeconfirmationbuttonsonsummary = block.getFieldValue('IncludeConfirmationButtonsOnSummary') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['formcustommessage'] = function(block) {
  var dropdown_key = block.getFieldValue('Key');
  var text_value = block.getFieldValue('Value');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['formcustomcommand'] = function(block) {
  var dropdown_commandtype = block.getFieldValue('CommandType');
  var text_description = block.getFieldValue('Description');
  var text_terms = block.getFieldValue('Terms');
  var text_helpmessage = block.getFieldValue('HelpMessage');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['datasource'] = function(block) {
  var number_stepid = block.getFieldValue('StepId');
  var text_expression = block.getFieldValue('Expression');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['conditionstep'] = function(block) {
  var value_conditionexpression = Blockly.JavaScript.valueToCode(block, 'ConditionExpression', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_truestep = Blockly.JavaScript.statementToCode(block, 'TrueStep');
  var statements_falsestep = Blockly.JavaScript.statementToCode(block, 'FalseStep');
  var value_datasource = Blockly.JavaScript.valueToCode(block, 'DataSource', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['relationalexpression'] = function(block) {
  var value_left = Blockly.JavaScript.valueToCode(block, 'Left', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_operator = block.getFieldValue('Operator');
  var value_right = Blockly.JavaScript.valueToCode(block, 'Right', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['binarylogicalexpression'] = function(block) {
  var value_left = Blockly.JavaScript.valueToCode(block, 'Left', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_operator = block.getFieldValue('Operator');
  var value_right = Blockly.JavaScript.valueToCode(block, 'Right', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['unarylogicalexpression'] = function(block) {
  var value_left = Blockly.JavaScript.valueToCode(block, 'Left', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['stepexpression'] = function(block) {
  var number_stepid = block.getFieldValue('StepId');
  var text_expression = block.getFieldValue('Expression');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['literal'] = function(block) {
  var text_value = block.getFieldValue('Value');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['navigatelistitem'] = function(block) {
  var text_title = block.getFieldValue('Title');
  var text_subtitle = block.getFieldValue('SubTitle');
  var text_imageurl = block.getFieldValue('ImageUrl');
  var text_buttontitle = block.getFieldValue('ButtonTitle');
  var text_buttonvalue = block.getFieldValue('ButtonValue');
  var statements_targetstep = Blockly.JavaScript.statementToCode(block, 'TargetStep');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['openurllistitem'] = function(block) {
  var text_title = block.getFieldValue('Title');
  var text_subtitle = block.getFieldValue('SubTitle');
  var text_imageurl = block.getFieldValue('ImageUrl');
  var text_buttontitle = block.getFieldValue('ButtonTitle');
  var text_buttonvalue = block.getFieldValue('ButtonValue');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['downloadfilelistitem'] = function(block) {
  var text_title = block.getFieldValue('Title');
  var text_subtitle = block.getFieldValue('SubTitle');
  var text_imageurl = block.getFieldValue('ImageUrl');
  var text_buttontitle = block.getFieldValue('ButtonTitle');
  var text_buttonvalue = block.getFieldValue('ButtonValue');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['apistep'] = function(block) {
  var dropdown_verb = block.getFieldValue('Verb');
  var text_apiurl = block.getFieldValue('ApiURL');
  var text_resource = block.getFieldValue('Resource');
  var statements_parameters = Blockly.JavaScript.statementToCode(block, 'Parameters');
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var value_datasource = Blockly.JavaScript.valueToCode(block, 'DataSource', Blockly.JavaScript.ORDER_ATOMIC);
  var value_loadingmessage = Blockly.JavaScript.valueToCode(block, 'LoadingMessage', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['apiparameter'] = function(block) {
  var text_name = block.getFieldValue('Name');
  var text_value = block.getFieldValue('Value');
  var dropdown_type = block.getFieldValue('Type');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['goto'] = function(block) {
  var text_id = block.getFieldValue('Id');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['compositestep'] = function(block) {
  var text_name = block.getFieldValue('Name');
  var statements_steps = Blockly.JavaScript.statementToCode(block, 'Steps');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['faqstep'] = function(block) {
  var value_askquestionmessage = Blockly.JavaScript.valueToCode(block, 'AskQuestionMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var number_minimumscore = block.getFieldValue('MinimumScore');
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var value_faqsettings = Blockly.JavaScript.valueToCode(block, 'FaqSettings', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['faqsettings'] = function(block) {
  var dropdown_servicetype = block.getFieldValue('ServiceType');
  var text_knowledgebaseid = block.getFieldValue('KnowledgeBaseId');
  var text_endpointkey = block.getFieldValue('EndpointKey');
  var text_endpoint = block.getFieldValue('Endpoint');
  var number_maxanswers = block.getFieldValue('MaxAnswers');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['mapsstep'] = function(block) {
  var dropdown_servicetype = block.getFieldValue('ServiceType');
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  var checkbox_selectable = block.getFieldValue('Selectable') == 'TRUE';
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var value_datasource = Blockly.JavaScript.valueToCode(block, 'DataSource', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['locationsource'] = function(block) {
  var text_name = block.getFieldValue('Name');
  var text_latitude = block.getFieldValue('Latitude');
  var text_longitude = block.getFieldValue('Longitude');
  var text_zipcode = block.getFieldValue('ZipCode');
  var text_address = block.getFieldValue('Address');
  var text_state = block.getFieldValue('State');
  var text_city = block.getFieldValue('City');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['switchstep'] = function(block) {
  var text_input = block.getFieldValue('Input');
  var statements_cases = Blockly.JavaScript.statementToCode(block, 'Cases');
  var value_datasource = Blockly.JavaScript.valueToCode(block, 'DataSource', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['case'] = function(block) {
  var text_value = block.getFieldValue('Value');
  var statements_targetstep = Blockly.JavaScript.statementToCode(block, 'TargetStep');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['imageclassificationstep'] = function(block) {
  var value_askimagemessage = Blockly.JavaScript.valueToCode(block, 'AskImageMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var value_retrymessage = Blockly.JavaScript.valueToCode(block, 'RetryMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var value_toomanyattemptsmessage = Blockly.JavaScript.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var number_attempts = block.getFieldValue('Attempts');
  var number_maxresults = block.getFieldValue('MaxResults');
  var number_minscore = block.getFieldValue('MinScore');
  var number_errorstepid = block.getFieldValue('ErrorStepId');
  var value_imageclassificationsettings = Blockly.JavaScript.valueToCode(block, 'ImageClassificationSettings', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['imageclassificationsettings'] = function(block) {
  var dropdown_servicetype = block.getFieldValue('ServiceType');
  var text_projectid = block.getFieldValue('ProjectId');
  var text_predictionendpoint = block.getFieldValue('PredictionEndpoint');
  var text_predictionkey = block.getFieldValue('PredictionKey');
  var text_trainingendpoint = block.getFieldValue('TrainingEndpoint');
  var text_trainingkey = block.getFieldValue('TrainingKey');
  // TODO: Assemble JavaScript into code variable.
  var code = '...';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['readgpslocationstep'] = function(block) {
  var value_asklocationmessage = Blockly.JavaScript.valueToCode(block, 'AskLocationMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var value_retrymessage = Blockly.JavaScript.valueToCode(block, 'RetryMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var value_toomanyattemptsmessage = Blockly.JavaScript.valueToCode(block, 'TooManyAttemptsMessage', Blockly.JavaScript.ORDER_ATOMIC);
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  var number_attempts = block.getFieldValue('Attempts');
  var number_errorstepid = block.getFieldValue('ErrorStepId');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['transformation'] = function(block) {
  var text_inputexpression = block.getFieldValue('InputExpression');
  var text_outputexpression = block.getFieldValue('OutputExpression');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['file'] = function(block) {
  var text_filename = block.getFieldValue('Filename');
  var text_url = block.getFieldValue('Url');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['handoffstep'] = function(block) {
  var text_url = block.getFieldValue('URL');
  var checkbox_durable = block.getFieldValue('Durable') == 'TRUE';
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['transformstep'] = function(block) {
  var text_propertypath = block.getFieldValue('PropertyPath');
  var statements_input = Blockly.JavaScript.statementToCode(block, 'Input');
  var value_datasource = Blockly.JavaScript.valueToCode(block, 'DataSource', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['simplemessagestep'] = function(block) {
  var text_message = block.getFieldValue('Message');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['simpleinputstep'] = function(block) {
  var text_message = block.getFieldValue('Message');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['simpleconfirmstep'] = function(block) {
  var text_mensagem = block.getFieldValue('Mensagem');
  var statements_truestep = Blockly.JavaScript.statementToCode(block, 'TrueStep');
  var statements_falsestep = Blockly.JavaScript.statementToCode(block, 'FalseStep');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['simpleliststep'] = function(block) {
  var text_message = block.getFieldValue('Message');
  var statements_input = Blockly.JavaScript.statementToCode(block, 'Input');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};

Blockly.JavaScript['simplelistitem'] = function(block) {
  var text_title = block.getFieldValue('Title');
  var statements_targetstep = Blockly.JavaScript.statementToCode(block, 'TargetStep');
  // TODO: Assemble JavaScript into code variable.
  var code = '...;\n';
  return code;
};