const workspace = `<xml xmlns="https://developers.google.com/blockly/xml" id="workspaceBlocks" style="display: none">
<block type="botconfig" id="4O%j;RlG2DOyB1V|eNTE" x="-112" y="-437">
  <field name="Name">Nome</field>
  <statement name="CustomCommands">
    <block type="customcommandconfig" id="2UKr!l]2G1x(i32puDkr" collapsed="true">
      <field name="CommandText">/start</field>
      <field name="Startup">TRUE</field>
      <field name="ClearDialogStack">FALSE</field>
      <field name="DeleteProfile">FALSE</field>
      <field name="InvalidateCache">FALSE</field>
      <field name="CustomMessageReply"></field>
      <next>
        <block type="customcommandconfig" id="KLbrY-m;!L8ch3|,UjSl" collapsed="true">
          <field name="CommandText">/reiniciar</field>
          <field name="Startup">FALSE</field>
          <field name="ClearDialogStack">TRUE</field>
          <field name="DeleteProfile">FALSE</field>
          <field name="InvalidateCache">FALSE</field>
          <field name="CustomMessageReply">Certo, vamos recomeçar então...</field>
          <next>
            <block type="customcommandconfig" id="ykgnq~DeWPbR1whaLAI)" collapsed="true">
              <field name="CommandText">/esquecer</field>
              <field name="Startup">FALSE</field>
              <field name="ClearDialogStack">TRUE</field>
              <field name="DeleteProfile">TRUE</field>
              <field name="InvalidateCache">FALSE</field>
              <field name="CustomMessageReply">Certo, seus dados foram excluídos. Vamos recomeçar então...</field>
              <next>
                <block type="customcommandconfig" id=".o?XDIXSLW^mx2jKKvuP" collapsed="true">
                  <field name="CommandText">/recarregar</field>
                  <field name="Startup">FALSE</field>
                  <field name="ClearDialogStack">TRUE</field>
                  <field name="DeleteProfile">TRUE</field>
                  <field name="InvalidateCache">TRUE</field>
                  <field name="CustomMessageReply">Fluxo recarregado. </field>
                </block>
              </next>
            </block>
          </next>
        </block>
      </next>
    </block>
  </statement>
  <value name="SpeechSettings">
    <block type="speechsettings" id="}IV#iM(yn9/@tKQ/$[.V" collapsed="true">
      <field name="Language">pt-BR</field>
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
  </value>
  <value name="AppCredentials">
    <block type="appcredentials" id="vHuz#A_d^Cr/goH0D#%?" collapsed="true">
      <field name="AppId"></field>
      <field name="AppPassword"></field>
    </block>
  </value>
  <value name="StoreSettings">
    <block type="storesettings" id="3qmTtb,@t04UjM2ECmL0" collapsed="true">
      <field name="PersistenceStrategy">InMemory</field>
      <field name="ConnectionString"></field>
    </block>
  </value>
</block>
</xml>`;

export default workspace;
