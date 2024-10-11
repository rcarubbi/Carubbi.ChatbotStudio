import React, { useEffect } from "react";
import Flowchart from "react-simple-flowchart";
import Blockly from "blockly/core";
import PerfectScrollbar from "perfect-scrollbar";

import "./codeGenerator.js";

let ps = null;
export default function FlowchartComponent(props) {
  const flowchartContainer = React.useRef(null);
  const opt = {
    "line-width": 2,
    "line-length": 25,
    "text-margin": 10,
    "font-size": 14,
    font: "normal",
    "font-family": "Helvetica",
    "font-weight": "normal",
    "font-color": "black",
    "line-color": "black",
    "element-color": "black",
    fill: "black",
    "yes-text": "yes",
    "no-text": "no",
    "arrow-end": "block",
    scale: 1,
    symbols: {
      start: {
        "font-color": "white",
        fill: "#5B5BA5"
      },
      end: {
        "border-radius": "5px",
        "font-color": "white",
        fill: "black"
      }
    },
    flowstate: {
      messagestep: {
        fill: "#80A55B",
        "font-color": "white"
      },
      messagestepselected: {
        fill: "#80A55B",
        "element-color": "yellow",
        "font-color": "white"
      },
      inputstep: {
        fill: "#5BA5A5",
        "font-color": "white"
      },
      inputstepselected: {
        fill: "#5BA5A5",
        "element-color": "yellow",
        "font-color": "white"
      },
      formstep: {
        fill: "#5ba582",
        "font-color": "white"
      },
      formstepselected: {
        fill: "#5ba582",
        "element-color": "yellow",
        "font-color": "white"
      },
      confirmstep: {
        "font-color": "white",
        fill: "#805BA5"
      },
      confirmstepselected: {
        fill: "#805BA5",
        "element-color": "yellow",
        "font-color": "white"
      },
      liststep: {
        fill: "#a5935b",
        "font-color": "white"
      },
      liststepselected: {
        fill: "#a5935b",
        "element-color": "yellow",
        "font-color": "white"
      },
      conditionstep: {
        fill: "#5b5ba5",
        "font-color": "white"
      },
      conditionstepselected: {
        fill: "#5b5ba5",
        "element-color": "yellow",
        "font-color": "white"
      },
      apistep: {
        fill: "#80a55b",
        "font-color": "white"
      },
      apistepselected: {
        fill: "#80a55b",
        "element-color": "yellow",
        "font-color": "white"
      },
      compositestep: {
        fill: "#A55B80",
        "font-color": "white"
      },
      compositestepselected: {
        fill: "#A55B80",
        "element-color": "yellow",
        "font-color": "white"
      },
      faqstep: {
        fill: "#A5805B",
        "font-color": "white"
      },
      faqstepselected: {
        fill: "#A5805B",
        "element-color": "yellow",
        "font-color": "white"
      },
      mapsstep: {
        fill: "#5BA55B",
        "font-color": "white"
      },
      mapsstepselected: {
        fill: "#5BA55B",
        "element-color": "yellow",
        "font-color": "white"
      },
      switchstep: {
        fill: "#a5935b",
        "font-color": "white"
      },
      switchstepselected: {
        fill: "#a5935b",
        "element-color": "yellow",
        "font-color": "white"
      },
      readgpslocationstep: {
        fill: "#5ba5a5",
        "font-color": "white"
      },
      readgpslocationstepselected: {
        fill: "#5ba5a5",
        "element-color": "yellow",
        "font-color": "white"
      },
      imageclassificationstep: {
        fill: "#805ba5",
        "font-color": "white"
      },
      imageclassificationstepselected: {
        fill: "#805ba5",
        "element-color": "yellow",
        "font-color": "white"
      },
      transformstep: {
        fill: "#a55ba5",
        "font-color": "white"
      },
      transformstepselected: {
        fill: "#a55ba5",
        "element-color": "yellow",
        "font-color": "white"
      },
      handoffstep: {
        fill: "#a55ba5",
        "font-color": "white"
      },
      handoffstepselected: {
        fill: "#a55ba5",
        "element-color": "yellow",
        "font-color": "white"
      }
    }
  };
  const defaultCode = `st=>start: Start
  e=>end: End
  st->e
  `;
  const generateFlowchart = () => {
     
    const code =
      props.blocklyComponentToSync &&
      props.blocklyComponentToSync.current &&
      props.blocklyComponentToSync.current.workspace
        ? Blockly.Flowchart.fromWorkspace(
            props.blocklyComponentToSync.current.workspace
          )
        : defaultCode;
    if (ps) ps.update();
    return code;
  };

  useEffect(() => {
    ps = new PerfectScrollbar(flowchartContainer.current, {});

    return function cleanUp() {
      ps.destroy();
    };
  }, []);

  console.log(generateFlowchart());

  return (
    <div
      ref={flowchartContainer}
      style={{
        position: "relative",
        width: "95%",
        padding: "10px 10px 10px 10px",
        height: "80vh",
        backgroundColor: "white",
        border: "#c6c6c6 1px solid",
        borderRadius: "6px"
      }}
    >
      <Flowchart
        chartCode={generateFlowchart() || defaultCode}
        options={opt}
        onClick={props.onNodeSelected}
      />
    </div>
  );
}
