import React, { useEffect, useCallback, useState, useRef } from "react";
import { withRouter } from "react-router";
import { primaryColor } from "../../assets/material-dashboard/jss/material-dashboard-react.jsx";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import NotificationImportant from "@material-ui/icons/NotificationImportant";
import GridItem from "../../components/material-dashboard/Grid/GridItem.jsx";
import GridContainer from "../../components/material-dashboard/Grid/GridContainer.jsx";
import BlocklyComponent from "../../components/custom/BlocklyComponent";
import toolbox from "../../configs/toolbox";
import FlowchartComponent from "../../components/custom/FlowchartComponent";
import "../../configs/customblocks";
import Blockly from "blockly/core";
import workspace from "../../configs/workspace";
import Button from "../../components/material-dashboard/CustomButtons/Button.jsx";
import Snackbar from "../../components/material-dashboard/Snackbar/Snackbar";
import WebChat from "../../components/custom/WebChat";
import api from "../../services/api";

const styles = {
  loading: {
    color: primaryColor[0],
    textAlign: "center",
  },
  builderGridItem: {
    padding: "0px 0px !important",
  },
  builderGridContainer: {
    margin: "0px 0px !important",
  },
};

function BuilderPage(props) {
  const {
    classes,
    location: { state },
  } = props;

  const botId = useRef(state && state.id);

  const [showWebchat, setShowWebchat] = useState(false);
  const blocklyComponentReference = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toasterOpened, setToasterOpened] = useState(false);
  const [runtime, setRuntime] = useState("");

  const [toasterMessage, setToasterMessage] = useState({
    Message: "",
    Color: "success",
  });

  let toasterHandler = useRef(null);

  const [lastBlocklyUpdate, setLastBlocklyUpdate] = useState(new Date());
  const handleNodeSelected = useCallback((nodeName) => {
    const { current: blocklyComponent } = blocklyComponentReference;
    const blockId = getBlockId(nodeName);
    const id = blockId.replace("step", "").split("i")[0];
    blocklyComponent.collapseStepBlocks();

    const block = blocklyComponent.getStepBlockById(id);
    if (block) {
      block.select();
      var blockToExpand = block;
      do {
        blockToExpand.setCollapsed(false);
        blockToExpand = blockToExpand.getSurroundParent();
      } while (blockToExpand);
      blocklyComponent.scrollToBlock(block);
    }
  }, []);

  const setBlockId = useCallback((block) => {
    const { current: blocklyComponent } = blocklyComponentReference;
    if (block === null) return;
    if (block.type === "goto") return;

    const id = block.getField("Id");
    if (id) {
      block.setFieldValue(blocklyComponent.getNextStepBlockId(), "Id");
    }

    for (let i = 0; i < block.childBlocks_.length; i++) {
      setBlockId(block.childBlocks_[i]);
    }
  }, []);

  const getBlockId = (nodeName) => {
    if (nodeName.startsWith("step")) {
      return nodeName;
    }

    const nameParts = nodeName.split(" ").filter((el) => el.trim() !== "");
    if (parseInt(nameParts[0])) {
      return `step${nameParts[0]}`;
    } else {
      return `step${nameParts[nameParts.length - 1]}`;
    }
  };

  const handleWorkspaceChanged = useCallback(
    (event) => {
      const { current: blocklyComponent } = blocklyComponentReference;
      if (!blocklyComponent) return;
      const { workspace: ws } = blocklyComponent;

      const workspaceLoadHandler = setTimeout(() => {
        if (blocklyComponent) {
          Blockly.svgResize(blocklyComponent.workspace);
        }
      }, 250);

      const block = ws.getBlockById(event.blockId || event.newValue);

      if (event.type === Blockly.Events.BLOCK_CREATE) {
        setBlockId(block);
      }

      if (
        event.type === Blockly.Events.UI ||
        event.type === Blockly.Events.BLOCK_MOVE
      ) {
        if (block) {
          Blockly.Flowchart.SelectedId = block.getFieldValue("Id");
          setSelectedId(Blockly.Flowchart.SelectedId);
        }
      }
      setLastBlocklyUpdate(new Date());

      return function cleanUp() {
        clearTimeout(workspaceLoadHandler);
      };
    },
    [setBlockId]
  );

  const overrideContextMenu = useCallback(() => {
    const originalBlocklyContextMenuPopulate = Blockly.ContextMenu.populate_;
    const {
      current: { options: wsOptions },
    } = blocklyComponentReference;

    Blockly.ContextMenu.populate_ = function (options, rtl) {
      const menu = originalBlocklyContextMenuPopulate(
        wsOptions.toogleInputMode
          ? options
          : options.filter(
              (x) =>
                x.text !== Blockly.Msg["INLINE_INPUTS"] &&
                x.text !== Blockly.Msg["EXTERNAL_INPUTS"]
            ),
        rtl
      );
      return menu;
    };
  }, []);

  const getBot = useCallback(async () => {
    const response = await api.get(`/api/bot/${botId.current}`);
    const devVersions = response.data.Versions.filter(
      (i) => i.PublishedAt == null
    );
    const currentVersion =
      devVersions.length > 0
        ? devVersions[0]
        : response.data.Versions.reverse((prev, next) => prev.PublishedAt)[0];

    setRuntime(currentVersion.Runtime);
    return currentVersion.Design;
  }, []);

  const loadBot = useCallback(async () => {
    const { current: blocklyComponent } = blocklyComponentReference;

    if (!botId.current) return;

    const design = await getBot();
    blocklyComponent.loadXml(design);
  }, [botId, getBot]);

  const handleSaveOnClick = useCallback(async () => {
    const updateBot = async () => {
      const { current: blocklyComponent } = blocklyComponentReference;

      await api.put("api/bot", {
        jsonRuntime: blocklyComponent.getJsonRuntime(),
        xmlDesign: blocklyComponent.getXmlDesign(),
        id: await botId.current,
      });
    };

    const saveBot = async () => {
      const { current: blocklyComponent } = blocklyComponentReference;

      const response = await api.post("api/bot", {
        jsonRuntime: blocklyComponent.getJsonRuntime(),
        xmlDesign: blocklyComponent.getXmlDesign(),
      });

      return response.data.Id;
    };

    try {
      setSaving(true);
      botId.current ? await updateBot() : (botId.current = await saveBot());
      setToasterMessage({
        Message: "Bot salvo com sucesso!",
        Color: "success",
      });
      setToasterOpened(true);
      getBot();
    } catch (err) {
      let errorMessage = "";
      if (err.response) {
        errorMessage = err.response.data.ExceptionMessage;
        let innerException = err.response.data.InnerException;
        while (innerException) {
          errorMessage += `\r\n${innerException.ExceptionMessage}`;
          innerException = innerException.InnerException;
        }
      } else {
        errorMessage = err.message;
      }

      setToasterMessage({
        Message: `Erro ao salvar o bot: ${errorMessage}`,
        Color: "danger",
      });
      setToasterOpened(true);
    } finally {
      setSaving(false);
    }
  }, [botId, getBot]);

  const handleBackOnClick = useCallback(() => {
    props.history.push("/admin/bots");
  }, [props.history]);

  const handleWebchatClick = useCallback(() => {
    setShowWebchat(!showWebchat);
  }, [showWebchat]);

  useEffect(() => {
    loadBot();
    overrideContextMenu();
  }, [overrideContextMenu, loadBot]);

  useEffect(() => {
    if (toasterOpened) {
      toasterHandler.current = setTimeout(() => {
        setToasterOpened(false);
      }, 3000);
    }

    return function cleanUp() {
      if (toasterHandler && toasterHandler.current) {
        clearTimeout(toasterHandler.current);
      }
    };
  }, [toasterOpened]);

  return (
    <GridContainer
      justifyContent="flex-end"
      className={classes.builderGridContainer}
    >
      <GridItem xs={12} sm={12} md={8} className={classes.builderGridItem}>
        <BlocklyComponent
          botId={botId.current}
          ref={blocklyComponentReference}
          initialXml={workspace}
          toolboxXml={toolbox}
          handleWorkspaceChanged={handleWorkspaceChanged}
        ></BlocklyComponent>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <FlowchartComponent
          selectedId={selectedId}
          onNodeSelected={handleNodeSelected}
          blocklyComponentToSync={blocklyComponentReference}
          blocklyUpdated={lastBlocklyUpdate}
        ></FlowchartComponent>
      </GridItem>
      <GridItem xs={12} sm={12} md={4}>
        <GridContainer
          justifyContent="flex-end"
          style={{ paddingRight: "34px" }}
        >
          <Button
            onClick={handleSaveOnClick}
            color="primary"
            style={{ width: "102px" }}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar"}
          </Button>

          <Button
            onClick={handleWebchatClick}
            color="info"
            disabled={!botId.current}
          >
            {showWebchat ? "Ocultar" : "Exibir"} Webchat
          </Button>
          <Button onClick={handleBackOnClick} color="transparent">
            Voltar
          </Button>
          <Snackbar
            place="tr"
            color={toasterMessage.Color}
            icon={NotificationImportant}
            message={toasterMessage.Message}
            open={toasterOpened}
            closeNotification={() => setToasterOpened(false)}
            close
            onMouseEnter={() => {
              clearTimeout(toasterHandler.current);
            }}
            onMouseLeave={() => {
              toasterHandler.current = setTimeout(() => {
                setToasterOpened(false);
              }, 3000);
            }}
          />
        </GridContainer>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <WebChat visible={showWebchat} runtime={runtime} />
      </GridItem>
    </GridContainer>
  );
}

BuilderPage.propTypes = {
  classes: PropTypes.object,
};

export default withRouter(withStyles(styles)(BuilderPage));
