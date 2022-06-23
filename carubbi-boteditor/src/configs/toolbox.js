const toolbox = 
    `<xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
    <category name="Atalhos">
      <block type="simplemessagestep">
        <field name="Id"></field>
        <field name="Message"></field>
      </block>
      <block type="simpleinputstep">
        <field name="Id"></field>
        <field name="Message"></field>
      </block>
      <block type="simpleconfirmstep">
        <field name="Id"></field>
        <field name="Mensagem"></field>
      </block>
      <block type="simpleliststep">
        <field name="Id"></field>
        <field name="Message"></field>
        <statement name="Input">
          <shadow type="simplelistitem">
            <field name="Title"></field>
          </shadow>
        </statement>
      </block>
      <block type="simplelistitem">
        <field name="Title"></field>
      </block>
    </category>
    <category name="Passos">
      <block type="messagestep" collapsed="true">
        <field name="Id"></field>
        <value name="Messages">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
      </block>
      <block type="confirmstep" collapsed="true">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <field name="YesText">Sim</field>
        <field name="NoText">Não</field>
        <field name="Attempts">3</field>
        <value name="Question">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto da pergunta</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="RetryMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Não entendi, pode repetir?</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="TooManyAttemptsMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Muitas tentativas, vamos voltar do início...</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <statement name="YesAcceptedAnswers">
          <shadow type="string">
            <field name="Value">Sim</field>
          </shadow>
        </statement>
        <statement name="NoAcceptedAnswers">
          <shadow type="string">
            <field name="Value">Não</field>
          </shadow>
        </statement>
      </block>
      <block type="inputstep" collapsed="true">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <value name="Question">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="NLPSettings">
          <shadow type="nlpsettings">
            <field name="NlpServiceType">Luis</field>
            <statement name="Models">
              <shadow type="nlpmodel">
                <field name="AppId"></field>
                <field name="PredictionKey"></field>
                <field name="PredictionEndpoint"></field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="TextAnalysisSettings">
          <shadow type="textanalysissettings">
            <field name="TextAnalysisServiceType">MicrosoftTextAnalysis</field>
            <field name="Language">pt-BR</field>
            <field name="SubscriptionKey"></field>
            <field name="Endpoint"></field>
          </shadow>
        </value>
      </block>
      <block type="formstep" collapsed="true">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <statement name="FormFields">
          <shadow type="formfield">
            <field name="Name">Nome</field>
            <field name="Question">Texto</field>
            <field name="Optional">FALSE</field>
            <field name="Type">None</field>
            <field name="NlpEntityName"></field>
            <field name="ValidationApiURL">http://</field>
            <field name="ValidationFailedMessage">Resposta Inválida</field>
            <field name="ActiveApiURL">http://</field>
            <next>
              <shadow type="optionsformfield">
                <field name="Name">Nome</field>
                <field name="Question">Texto</field>
                <field name="Optional">FALSE</field>
                <field name="Type">None</field>
                <field name="NlpEntityName"></field>
                <field name="ValidationApiURL">http://</field>
                <field name="ValidationFailedMessage">Resposta Inválida</field>
                <field name="ActiveApiURL">http://</field>
                <statement name="Options">
                  <shadow type="fieldoption">
                    <field name="Value">Valor</field>
                    <field name="Description">Descrição</field>
                  </shadow>
                </statement>
                <next>
                  <shadow type="optionsformfield">
                    <field name="Name">Nome</field>
                    <field name="Question">Texto</field>
                    <field name="Optional">FALSE</field>
                    <field name="Type">None</field>
                    <field name="NlpEntityName"></field>
                    <field name="ValidationApiURL">http://</field>
                    <field name="ValidationFailedMessage">Resposta Inválida</field>
                    <field name="ActiveApiURL">http://</field>
                    <statement name="Options">
                      <shadow type="fieldoptionsource">
                        <field name="OptionsSource">http://</field>
                      </shadow>
                    </statement>
                    <next>
                      <shadow type="restoreformfield">
                        <field name="Name">Nome</field>
                        <field name="Question">Texto</field>
                        <comment pinned="false" h="80" w="160">  Você pode utilizar o valor respondido anteriormente no texto da
              pergunta utilizando o nome dos campos entre #'s.Ex: Você vai
              responder novamente como #Nome#?
                        
                        </comment>
                        <statement name="RestoreFields">
                          <shadow type="string">
                            <field name="Value">Texto</field>
                          </shadow>
                        </statement>
                      </shadow>
                    </next>
                  </shadow>
                </next>
              </shadow>
            </next>
          </shadow>
        </statement>
        <value name="Summary">
          <shadow type="summary">
            <field name="SummaryText">Texto</field>
            <field name="IncludeFieldListOnSummary">TRUE</field>
            <field name="IncludeConfirmationButtonsOnSummary">TRUE</field>
          </shadow>
        </value>
        <statement name="FormCustomMessages">
          <shadow type="formcustommessage">
            <field name="Key">Yes</field>
            <field name="Value">Valor</field>
          </shadow>
        </statement>
        <statement name="FormCustomCommands">
          <shadow type="formcustomcommand">
            <field name="CommandType">Help</field>
            <field name="Description"></field>
            <field name="Terms"></field>
            <field name="HelpMessage"></field>
          </shadow>
        </statement>
        <value name="NlpSettings">
          <shadow type="nlpsettings">
            <field name="NlpServiceType">None</field>
          </shadow>
        </value>
      </block>
      <block type="conditionstep" collapsed="true">
        <field name="Id"></field>
        <value name="ConditionExpression">
          <shadow type="relationalexpression">
            <field name="Operator">Equals</field>
            <value name="Left">
              <shadow type="stepexpression">
                <field name="StepId">1</field>
                <field name="Expression">Output</field>
              </shadow>
            </value>
            <value name="Right">
              <shadow type="literal">
                <field name="Value">Literal</field>
              </shadow>
            </value>
          </shadow>
        </value>
      </block>
      <block type="liststep" collapsed="true">
        <field name="Id"></field>
        <field name="ListType">ImageList</field>
        <field name="Durable">FALSE</field>
        <field name="Attempts">3</field>
        <value name="PromptMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <statement name="Input">
          <shadow type="navigatelistitem">
            <field name="Title"></field>
            <field name="SubTitle"></field>
            <field name="ImageUrl">http://</field>
            <field name="ButtonTitle"></field>
            <field name="ButtonValue"></field>
            <next>
              <shadow type="openurllistitem">
                <field name="Title"></field>
                <field name="SubTitle"></field>
                <field name="ImageUrl">http://</field>
                <field name="ButtonTitle"></field>
                <field name="ButtonValue">http://</field>
                <next>
                  <shadow type="downloadfilelistitem">
                    <field name="Title"></field>
                    <field name="SubTitle"></field>
                    <field name="ImageUrl">http://</field>
                    <field name="ButtonTitle"></field>
                    <field name="ButtonValue">http://</field>
                  </shadow>
                </next>
              </shadow>
            </next>
          </shadow>
        </statement>
        <value name="RetryMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Não entendi sua resposta, pode repetir?</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="TooManyAttemptsMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Muitas tentativas, vamos voltar do início...</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="NLPSettings">
          <shadow type="nlpsettings">
            <field name="NlpServiceType">Luis</field>
            <statement name="Models">
              <shadow type="nlpmodel">
                <field name="AppId"></field>
                <field name="PredictionKey"></field>
                <field name="PredictionEndpoint"></field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="DataSource">
          <shadow type="datasource">
            <field name="StepId">1</field>
            <field name="Expression">Expressão</field>
          </shadow>
        </value>
      </block>
      <block type="apistep" collapsed="true">
        <field name="Id"></field>
        <field name="Verb">Get</field>
        <field name="ApiURL">http://</field>
        <field name="Resource"></field>
        <field name="Durable">FALSE</field>
        <statement name="Parameters">
          <shadow type="apiparameter">
            <field name="Name"></field>
            <field name="Value"></field>
            <field name="Type">Default</field>
          </shadow>
        </statement>
      </block>
      <block type="goto">
        <field name="Id"></field>
      </block>
      <block type="compositestep" collapsed="true">
        <field name="Id"></field>
        <field name="Name"></field>
      </block>
      <block type="faqstep" collapsed="true">
        <field name="Id"></field>
        <field name="MinimumScore">0</field>
        <field name="Durable">FALSE</field>
        <value name="AskQuestionMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="FaqSettings">
          <shadow type="faqsettings">
            <field name="ServiceType">None</field>
            <field name="KnowledgeBaseId"></field>
            <field name="EndpointKey"></field>
            <field name="Endpoint"></field>
            <field name="MaxAnswers">0</field>
          </shadow>
        </value>
      </block>
      <block type="mapsstep" collapsed="true">
        <field name="Id"></field>
        <field name="ServiceType">None</field>
        <field name="ApiKey"></field>
        <field name="Selectable">FALSE</field>
        <field name="Durable">FALSE</field>
        <statement name="Input">
          <shadow type="locationsource">
            <field name="Name"></field>
            <field name="Latitude"></field>
            <field name="Longitude"></field>
            <field name="ZipCode"></field>
            <field name="Address"></field>
            <field name="State"></field>
            <field name="City"></field>
          </shadow>
        </statement>
        <value name="DataSource">
          <shadow type="datasource">
            <field name="StepId">1</field>
            <field name="Expression">Expressão</field>
          </shadow>
        </value>
      </block>
      <block type="switchstep" collapsed="true">
        <field name="Id"></field>
        <field name="Input"></field>
      </block>
      <block type="imageclassificationstep" collapsed="true">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <field name="Attempts">3</field>
        <field name="MaxResults">5</field>
        <field name="MinScore">0</field>
        <field name="ErrorStepId">0</field>
        <value name="AskImageMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="RetryMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="TooManyAttemptsMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="ImageClassificationSettings">
          <shadow type="imageclassificationsettings">
            <field name="ServiceType">None</field>
            <field name="ProjectId">Id do Projeto</field>
            <field name="PredictionEndpoint">Url</field>
            <field name="PredictionKey">Chave</field>
            <field name="TrainingEndpoint">Url</field>
            <field name="TrainingKey">Chave</field>
          </shadow>
        </value>
      </block>
      <block type="readgpslocationstep" collapsed="true">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <field name="Attempts">3</field>
        <field name="ErrorStepId">0</field>
        <value name="AskLocationMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="RetryMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
        <value name="TooManyAttemptsMessage">
          <shadow type="messageinteractions">
            <statement name="Typed">
              <shadow type="string">
                <field name="Value">Texto</field>
              </shadow>
            </statement>
          </shadow>
        </value>
      </block>
      <block type="transformstep" collapsed="true">
        <field name="Id"></field>
        <field name="PropertyPath"></field>
        <statement name="Input">
          <shadow type="transformation">
            <field name="InputExpression"></field>
            <field name="OutputExpression"></field>
          </shadow>
        </statement>
      </block>
      <block type="handoffstep" collapsed="true">
        <field name="Id"></field>
        <field name="URL">http://</field>
        <field name="Durable">FALSE</field>
      </block>
    </category>
    <category name="Texto">
      <block type="messagestep">
        <field name="Id"></field>
      </block>
      <block type="messageinteractions"></block>
      <block type="string">
        <field name="Value">Texto</field>
      </block>
      <block type="transformstep">
        <field name="Id"></field>
        <field name="PropertyPath"></field>
      </block>
      <block type="transformation">
        <field name="InputExpression"></field>
        <field name="OutputExpression"></field>
      </block>
      <block type="file">
        <field name="Filename"></field>
        <field name="Url">http://</field>
      </block>
    </category>
    <category name="Perguntas">
      <block type="inputstep">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
      </block>
      <block type="confirmstep">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <field name="YesText">Sim</field>
        <field name="NoText">Não</field>
        <field name="Attempts">3</field>
      </block>
    </category>
    <category name="Questionário">
      <block type="formstep">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
      </block>
      <block type="formfield">
        <field name="Name">Nome</field>
        <field name="Question">Texto</field>
        <field name="Optional">FALSE</field>
        <field name="Type">None</field>
        <field name="NlpEntityName"></field>
        <field name="ValidationApiURL">http://</field>
        <field name="ValidationFailedMessage">Resposta Inválida</field>
        <field name="ActiveApiURL">http://</field>
      </block>
      <block type="optionsformfield">
        <field name="Name">Nome</field>
        <field name="Question">Texto</field>
        <field name="Optional">FALSE</field>
        <field name="Type">None</field>
        <field name="NlpEntityName"></field>
        <field name="ValidationApiURL">http://</field>
        <field name="ValidationFailedMessage">Resposta Inválida</field>
        <field name="ActiveApiURL">http://</field>
      </block>
      <block type="fieldoption">
        <field name="Value">Valor</field>
        <field name="Description">Descrição</field>
      </block>
      <block type="fieldoptionsource">
        <field name="OptionsSource">http://</field>
      </block>
      <block type="restoreformfield">
        <field name="Name">Nome</field>
        <field name="Question">Texto</field>
        <comment pinned="false" h="80" w="160">  Você pode utilizar o valor respondido anteriormente no texto da
              pergunta utilizando o nome dos campos entre #'s.Ex: Você vai
              responder novamente como #Nome#?
        
        </comment>
      </block>
      <block type="summary">
        <field name="SummaryText">Texto</field>
        <field name="IncludeFieldListOnSummary">TRUE</field>
        <field name="IncludeConfirmationButtonsOnSummary">TRUE</field>
      </block>
      <block type="formcustommessage">
        <field name="Key">Yes</field>
        <field name="Value">Valor</field>
      </block>
      <block type="formcustomcommand">
        <field name="CommandType">Help</field>
        <field name="Description"></field>
        <field name="Terms"></field>
        <field name="HelpMessage"></field>
      </block>
    </category>
    <category name="Fluxo">
      <block type="conditionstep">
        <field name="Id"></field>
      </block>
      <block type="relationalexpression">
        <field name="Operator">Equals</field>
      </block>
      <block type="binarylogicalexpression">
        <field name="Operator">And</field>
      </block>
      <block type="unarylogicalexpression"></block>
      <block type="stepexpression">
        <field name="StepId">1</field>
        <field name="Expression">Expressão</field>
      </block>
      <block type="literal">
        <field name="Value">Literal</field>
      </block>
      <block type="switchstep">
        <field name="Id"></field>
        <field name="Input"></field>
      </block>
      <block type="case">
        <field name="Value"></field>
      </block>
      <block type="goto">
        <field name="Id"></field>
      </block>
      <block type="compositestep">
        <field name="Id"></field>
        <field name="Name"></field>
      </block>
      <block type="handoffstep">
        <field name="Id"></field>
        <field name="URL">http://</field>
        <field name="Durable">FALSE</field>
      </block>
    </category>
    <category name="Lista">
      <block type="liststep">
        <field name="Id"></field>
        <field name="ListType">ImageList</field>
        <field name="Durable">FALSE</field>
        <field name="Attempts">3</field>
      </block>
      <block type="navigatelistitem">
        <field name="Title"></field>
        <field name="SubTitle"></field>
        <field name="ImageUrl">http://</field>
        <field name="ButtonTitle"></field>
        <field name="ButtonValue"></field>
      </block>
      <block type="openurllistitem">
        <field name="Title"></field>
        <field name="SubTitle"></field>
        <field name="ImageUrl">http://</field>
        <field name="ButtonTitle"></field>
        <field name="ButtonValue">http://</field>
      </block>
      <block type="downloadfilelistitem">
        <field name="Title"></field>
        <field name="SubTitle"></field>
        <field name="ImageUrl">http://</field>
        <field name="ButtonTitle"></field>
        <field name="ButtonValue">http://</field>
      </block>
      <block type="datasource">
        <field name="StepId">1</field>
        <field name="Expression">Expressão</field>
      </block>
    </category>
    <category name="Serviços">
      <block type="nlpsettings">
        <field name="NlpServiceType">Luis</field>
      </block>
      <block type="nlpmodel">
        <field name="AppId"></field>
        <field name="PredictionKey"></field>
        <field name="PredictionEndpoint"></field>
      </block>
      <block type="textanalysissettings">
        <field name="TextAnalysisServiceType">None</field>
        <field name="Language">None</field>
        <field name="SubscriptionKey"></field>
        <field name="Endpoint">http://</field>
      </block>
      <block type="apistep">
        <field name="Id"></field>
        <field name="Verb">Get</field>
        <field name="ApiURL">http://</field>
        <field name="Resource"></field>
        <field name="Durable">FALSE</field>
      </block>
      <block type="apiparameter">
        <field name="Name"></field>
        <field name="Value"></field>
        <field name="Type">Default</field>
      </block>
      <block type="mapsstep">
        <field name="Id"></field>
        <field name="ServiceType">None</field>
        <field name="ApiKey"></field>
        <field name="Selectable">FALSE</field>
        <field name="Durable">FALSE</field>
      </block>
      <block type="locationsource">
        <field name="Name"></field>
        <field name="Latitude"></field>
        <field name="Longitude"></field>
        <field name="ZipCode"></field>
        <field name="Address"></field>
        <field name="State"></field>
        <field name="City"></field>
      </block>
      <block type="faqstep">
        <field name="Id"></field>
        <field name="MinimumScore">0</field>
        <field name="Durable">FALSE</field>
      </block>
      <block type="faqsettings">
        <field name="ServiceType">None</field>
        <field name="KnowledgeBaseId"></field>
        <field name="EndpointKey"></field>
        <field name="Endpoint"></field>
        <field name="MaxAnswers">0</field>
      </block>
      <block type="imageclassificationstep">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <field name="Attempts">3</field>
        <field name="MaxResults">5</field>
        <field name="MinScore">0</field>
        <field name="ErrorStepId">0</field>
      </block>
      <block type="imageclassificationsettings">
        <field name="ServiceType">None</field>
        <field name="ProjectId">Id do Projeto</field>
        <field name="PredictionEndpoint">Url</field>
        <field name="PredictionKey">Chave</field>
        <field name="TrainingEndpoint">Url</field>
        <field name="TrainingKey">Chave</field>
      </block>
      <block type="readgpslocationstep">
        <field name="Id"></field>
        <field name="Durable">FALSE</field>
        <field name="Attempts">3</field>
        <field name="ErrorStepId">0</field>
      </block>
    </category>
    <category name="Configurações">
      <block type="speechsettings">
        <field name="Language">None</field>
        <field name="RecognitionServiceType">BingSpeech</field>
        <field name="RecognitionServiceRegion">brazilsouth</field>
        <field name="RecognitionSubscriptionKey"></field>
        <field name="VoiceName">pt-BR-HeloisaRUS</field>
        <field name="SynthesisServiceType">BingSpeech</field>
        <field name="SynthesisServiceRegion">brazilsouth</field>
        <field name="SynthesisSubscriptionKey"></field>
        <field name="CacheType">None</field>
        <field name="StoreType">None</field>
      </block>
      <block type="customcommandconfig">
        <field name="CommandText">/comando</field>
        <field name="Startup">FALSE</field>
        <field name="ClearDialogStack">FALSE</field>
        <field name="DeleteProfile">FALSE</field>
        <field name="InvalidateCache">FALSE</field>
        <field name="CustomMessageReply">Comando executado</field>
      </block>
      <block type="appcredentials">
        <field name="AppId"></field>
        <field name="AppPassword"></field>
      </block>
      <block type="storesettings">
        <field name="PersistenceStrategy">InMemory</field>
        <field name="ConnectionString"></field>
      </block>
    </category>
    <category name="Canais">
      <block type="whatsappchannel"></block>
      <block type="telegramchannel">
        <field name="TelegramToken">Insira o token</field>
      </block>
    </category>
  </xml>`;

export default toolbox;
