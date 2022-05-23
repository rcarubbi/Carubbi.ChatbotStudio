import React from "react";
import "./styles.css";

import Blockly from "blockly/core";
import locale from "blockly/msg/pt-br";
import JsonBotDefinition from "./codeGenerator.js";

Blockly.setLocale(locale);

class BlocklyComponent extends React.Component {
  componentDidMount() {
    const {
      initialXml,
      toolboxXml,
      handleWorkspaceChanged,
      history,
      botId,
      ...rest
    } = this.props;
    const mediaUrl = `${process.env.PUBLIC_URL}/blockly-media/`;

    this.primaryOptions = {
      toolbox: toolboxXml,
      collapse: true,
      comments: true,
      disable: false,
      maxBlocks: Infinity,
      trashcan: true,
      media: mediaUrl,
      horizontalLayout: false,
      toolboxPosition: "start",
      css: true,
      rtl: false,
      scrollbars: true,
      sounds: true,
      oneBasedIndex: true,
      zoom: {
        controls: true,
        wheel: false,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
      },
      toogleInputMode: false,
      ...rest
    };
    this.primaryWorkspace = Blockly.inject(
      this.blocklyDiv,
      this.primaryOptions
    );

    if (initialXml && !botId) {
      this.loadXml(initialXml);
    }
  }

  max = items => {
    return items.reduce((acc, val) => {
      acc = acc === undefined || val > acc ? val : acc;
      return acc;
    }, 0);
  };

  loadXml = xml => {
    this.primaryWorkspace.addChangeListener(this.onBlockLoaded);
    this.primaryWorkspace.removeChangeListener(this.handleWorkspaceChanged);

    this.primaryWorkspace.clear();
    Blockly.Xml.domToWorkspace(
      Blockly.Xml.textToDom(xml),
      this.primaryWorkspace
    );
  };

  getNextStepBlockId = () => {
    const blockIds = this.getStepBlocks().map(x =>
      parseInt(x.getFieldValue("Id"))
    );
    return (this.max(blockIds) || 0) + 1;
  };

  getStepBlocks = () => {
    const { primaryWorkspace: ws } = this;
    const blocks = Object.values(ws.blockDB_);
    const stepBlocks = blocks.filter(x => x.getFieldValue("Id"));
    return stepBlocks;
  };
  getXmlDesign = () => {
    const xml = Blockly.Xml.workspaceToDom(this.primaryWorkspace);
    const xml_text = Blockly.Xml.domToText(xml);
    return xml_text;
  };

  getJsonRuntime = () => {
    const json = JsonBotDefinition.fromWorkspace(this.primaryWorkspace);
    return json;
  };

  getStepBlockById = id => {
    return this.getStepBlocks().filter(b => b.getFieldValue("Id") === id)[0];
  };

  collapseStepBlocks = () => {
    this.getStepBlocks().map(b => {
      b.setCollapsed(true);
      return null;
    });
  };

  scrollToBlock = block => {
    const { primaryWorkspace: ws } = this;
    const xy = block.getRelativeToSurfaceXY();
    const m = ws.getMetrics();
    ws.scrollbar.set(
      xy.x * ws.scale - m.contentLeft - m.viewWidth * 0.1,
      xy.y * ws.scale - m.contentTop - m.viewHeight * 0.1
    );
  };

  onBlockLoaded = event => {
    const {
      collapseStepBlocks,
      onBlockLoaded,
      primaryWorkspace: ws,
      props: { handleWorkspaceChanged }
    } = this;

    if (event.type === Blockly.Events.BLOCK_CREATE) {
      collapseStepBlocks();
      ws.centerOnBlock(event.blockId);
      ws.removeChangeListener(onBlockLoaded);
      if (handleWorkspaceChanged) {
        ws.addChangeListener(handleWorkspaceChanged);
      }
    }
  };

  get options() {
    return this.primaryOptions;
  }

  get workspace() {
    return this.primaryWorkspace;
  }

  render() {
   

    return (
      
        <div ref={e => (this.blocklyDiv = e)} id="blocklyDiv" />
      
    );
  }
}
 
export default BlocklyComponent;
