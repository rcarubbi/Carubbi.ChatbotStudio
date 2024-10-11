import Blockly from "blockly/core";

Blockly.Flowchart = new Blockly.Generator("Flowchart");
Blockly.Flowchart.ORDER_NONE = 99;
Blockly.Flowchart.ORDER_ATOMIC = 0;
Blockly.Flowchart.ORDER_STRING = 1;

let stepsToAddLater = {};

let currentScope = "botconfig";

const relationalOperators = {
  Equals: "=",
  Greater: ">",
  Less: "<",
  GreaterOrEquals: ">=",
  LessOrEquals: "<=",
  NotEquals: "<>"
};

const logicalOperators = {
  And: "&",
  Or: "|"
};

function getRelationalOperator(operatorDisplay) {
  return relationalOperators[operatorDisplay];
}

function getLogicalOperator(operatorDisplay) {
  return logicalOperators[operatorDisplay];
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
  stepsToAddLater[currentScope].steps =
    (Array.isArray(stepsToAddLater[currentScope].steps) &&
      stepsToAddLater[currentScope].steps.concat(steps)) ||
    steps;
}

Blockly.Flowchart.fromWorkspace = function(workspace) {
  currentScope = "botconfig";
  stepsToAddLater = {};

  var top_blocks = workspace.getTopBlocks(false);
  for (var i in top_blocks) {
    var top_block = top_blocks[i];
    if (top_block.type === "botconfig")
      return this.generalBlockToObj(top_block, workspace);
  }
};

Blockly.Flowchart.generalBlockToObj = function(block, workspace) {
  if (block && !block.isShadow_) {
    // dispatcher:
    var func = this[block.type];
    if (func) {
      return func.call(this, block, workspace);
    } else {
      console.log(
        "Don't know how to generate Flowchart code for a '" + block.type + "'"
      );
    }
  } else {
    return null;
  }
};

Blockly.Flowchart.scrub_ = function(block, code, opt_thisOnly) {
  var obj = null;
  try {
    obj = JSON.parse(code);
  } catch {
    obj = code;
  }
  var nextBlock = block.getNextBlock();
  if (nextBlock) {
    var array = Array.isArray(obj) ? obj : [obj];
    var nextCode = Blockly.Flowchart.blockToCode(nextBlock);
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

Blockly.Flowchart["botconfig"] = function(block, workspace) {
  var text_name = block.getFieldValue("Name");
  var statements_steps = statementToArray(
    Blockly.Flowchart.statementToCode(block, "Steps")
  );

  var steps = statements_steps;
  if (stepsToAddLater["botconfig"]) {
    steps = statements_steps.concat(stepsToAddLater["botconfig"].steps);
  }

  var flowchartDeclarations = [];
  var flowchartConnections = [];

  for (var i = 0; i < steps.length; i++) {
    flowchartConnections = flowchartConnections.concat(
      steps[i].flowchartConnections
    );
    flowchartDeclarations = flowchartDeclarations.concat(
      steps[i].flowchartDeclarations
    );
  }

  flowchartDeclarations.push(`root=>start: ${text_name || "Bot"}`);

  if (statements_steps[0]) {
    flowchartConnections.push(`root->step${statements_steps[0].id}`);
  } else {
    flowchartConnections.push("root->e");
    flowchartDeclarations.push("e=>end: End");
  }
  var code =
    flowchartDeclarations.reverse().join("\r\n") +
    "\r\n\r\n" +
    flowchartConnections.reverse().join("\r\n");
  return code;
};

Blockly.Flowchart["messagestep"] = function(block) {
  const label_id = block.getFieldValue("Id");
  const nextBlock = block.getNextBlock();

  const flowchartConnections = [];
  const flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  const selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: Message ${label_id}|messagestep${selected}`
  );

  const messageStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  const code = JSON.stringify(messageStep);

  return code;
};

Blockly.Flowchart["inputstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: Question ${label_id}|inputstep${selected}`
  );

  var inputStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(inputStep);

  return code;
};

Blockly.Flowchart["string"] = function(block) {
  return null;
};

Blockly.Flowchart["nlpsettings"] = function(block) {
  return null;
};

Blockly.Flowchart["textanalysissettings"] = function(block) {
  return null;
};

Blockly.Flowchart["nlpmodel"] = function(block) {
  return null;
};

Blockly.Flowchart["confirmstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var statements_truestep = statementToArray(
    Blockly.Flowchart.statementToCode(block, "TrueStep")
  );
  var statements_falsestep = statementToArray(
    Blockly.Flowchart.statementToCode(block, "FalseStep")
  );

  addStepsToLater(statements_truestep.concat(statements_falsestep));

  var trueStepId =
    (statements_truestep.length > 0 && statements_truestep[0].id) || null;
  var falseStepId =
    (statements_falsestep.length > 0 && statements_falsestep[0].id) || null;

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!trueStepId) {
    flowchartDeclarations.push(`eYes${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}(yes)->eYes${label_id}`);
  } else {
    flowchartConnections.push(`step${label_id}(yes)->step${trueStepId}`);
  }

  if (!falseStepId) {
    flowchartDeclarations.push(`eNo${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}(no)->eNo${label_id}`);
  } else {
    flowchartConnections.push(`step${label_id}(no)->step${falseStepId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>condition: Confirmation ${label_id}|confirmstep${selected}`
  );

  var confirmStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(confirmStep);
  return code;
};

Blockly.Flowchart["messageinteractions"] = function(block) {
  return null;
};

Blockly.Flowchart["liststep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var listItems = statementToArray(
    Blockly.Flowchart.statementToCode(block, "Input")
  ).filter(
    x => x.targetStepId || x.action === "OpenURL" || x.action === "DownloadFile"
  );

  // var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  for (var i = 0; i < listItems.length; i++) {
    if (i > 0) {
      flowchartDeclarations.push(
        `step${label_id}i${i + 1}=>parallel: List ${label_id} \r\n[${
          listItems[i].title
        }]|liststep${selected}`
      );
      if (i > 1) {
        flowchartConnections.push(
          `step${label_id}i${i}(path2, right)->step${label_id}i${i + 1}`
        );
        flowchartConnections.push(
          `step${label_id}i${i}@>step${label_id}i${i + 1}({"stroke": "${
            selected ? "yellow" : "#a5935b"
          }", "arrow-end": "none"})`
        );
      } else {
        flowchartConnections.push(
          `step${label_id}(path2, right)->step${label_id}i${i + 1}`
        );
        flowchartConnections.push(
          `step${label_id}@>step${label_id}i${i + 1}({"stroke": "${
            selected ? "yellow" : "#a5935b"
          }", "arrow-end": "none"})`
        );
      }
    } else {
      flowchartDeclarations.push(
        `step${label_id}=>parallel: List ${label_id} \r\n [${listItems[i].title}]|liststep${selected}`
      );
    }

    switch (listItems[i].action) {
      case "OpenURL":
      case "DownloadFile":
        var description =
          listItems[i].action === "OpenURL" ? `Open Url` : `Download file`;
        if (i > 0) {
          flowchartDeclarations.push(
            `end${label_id}i${i + 1}=>end: ${description}`
          );
          flowchartConnections.push(
            `step${label_id}i${i + 1}(path1, bottom)->end${label_id}i${i + 1}`
          );
        } else {
          flowchartDeclarations.push(`end${label_id}=>end: ${description}`);
          flowchartConnections.push(
            `step${label_id}(path1, bottom)->end${label_id}`
          );
        }
        break;
      default:
        if (i > 0) {
          flowchartConnections.push(
            `step${label_id}i${i + 1}(path1, bottom)->step${
              listItems[i].targetStepId
            }`
          );
        } else {
          flowchartConnections.push(
            `step${label_id}(path1, bottom)->step${listItems[i].targetStepId}`
          );
        }
        break;
    }
  }

  //if (nextBlock) {
  //    var nextBlockId = nextBlock.getFieldValue("Id");
  //    if (listItems.length === 0) {
  //        flowchartDeclarations.push(`step${label_id}=>parallel: List ${label_id}|liststep${selected}`);
  //        flowchartConnections.push(`step${label_id}(path1, bottom)->step${nextBlockId}`)
  //    } else {
  //        flowchartDeclarations.push(`step${label_id}i${listItems.length + 1}=>parallel: List ${label_id}|liststep${selected}`);
  //        if (listItems.length > 1) {
  //            flowchartConnections.push(`step${label_id}i${listItems.length}(path2, right)->step${label_id}i${listItems.length + 1}`)
  //            flowchartConnections.push(`step${label_id}i${listItems.length}@>step${label_id}i${listItems.length + 1}({"stroke": "${selected ? "yellow" : "#a5935b"}"})`);
  //        } else {
  //            flowchartConnections.push(`step${label_id}(path2, right)->step${label_id}i${listItems.length + 1}`);
  //            flowchartConnections.push(`step${label_id}@>step${label_id}i${listItems.length + 1}({"stroke": "${selected ? "yellow" : "#a5935b"}"})`);
  //        }
  //        flowchartConnections.push(`step${label_id}i${listItems.length + 1}(path1, bottom)->step${nextBlockId}`)

  //    }
  //} else
  if (listItems.length === 0) {
    flowchartDeclarations.push(
      `step${label_id}=>parallel: List ${label_id}|liststep${selected}`
    );
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}(path1)->e${label_id}`);
  }

  var listStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(listStep);
  return code;
};

Blockly.Flowchart["customcommandconfig"] = function(block) {
  return null;
};

Blockly.Flowchart["speechsettings"] = function(block) {
  return null;
};

Blockly.Flowchart["appcredentials"] = function(block) {
  return null;
};

Blockly.Flowchart["storesettings"] = function(block) {
  return null;
};

Blockly.Flowchart["formstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();
  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: Form ${label_id}|formstep${selected}`
  );

  var formStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(formStep);
  return code;
};

Blockly.Flowchart["formfield"] = function(block) {
  return null;
};

Blockly.Flowchart["optionsformfield"] = function(block) {
  return null;
};

Blockly.Flowchart["fieldoption"] = function(block) {
  return null;
};

Blockly.Flowchart["fieldoptionsource"] = function(block) {
  return null;
};

Blockly.Flowchart["restoreformfield"] = function(block) {
  return null;
};

Blockly.Flowchart["summary"] = function(block) {
  return null;
};

Blockly.Flowchart["formcustommessage"] = function(block) {
  return null;
};

Blockly.Flowchart["formcustomcommand"] = function(block) {
  return null;
};

Blockly.Flowchart["datasource"] = function(block) {
  return null;
};

Blockly.Flowchart["conditionstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var statements_truestep = statementToArray(
    Blockly.Flowchart.statementToCode(block, "TrueStep")
  );
  var statements_falsestep = statementToArray(
    Blockly.Flowchart.statementToCode(block, "FalseStep")
  );

  addStepsToLater(statements_truestep.concat(statements_falsestep));

  var trueStepId =
    (statements_truestep.length > 0 && statements_truestep[0].id) || null;
  var falseStepId =
    (statements_falsestep.length > 0 && statements_falsestep[0].id) || null;
  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!trueStepId) {
    flowchartDeclarations.push(`eYes${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}(yes)->eYes${label_id}`);
  } else {
    flowchartConnections.push(`step${label_id}(yes)->step${trueStepId}`);
  }

  if (!falseStepId) {
    flowchartDeclarations.push(`eNo${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}(no)->eNo${label_id}`);
  } else {
    flowchartConnections.push(`step${label_id}(no)->step${falseStepId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>condition: Condition ${label_id}|conditionstep${selected}`
  );

  var conditionStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(conditionStep);

  return code;
};

Blockly.Flowchart["relationalexpression"] = function(block) {
  if (block.isShadow_) return null;

  var value_left = parseValue(
    Blockly.Flowchart.valueToCode(block, "Left", Blockly.Flowchart.ORDER_ATOMIC)
  );
  var dropdown_operator = block.getFieldValue("Operator");
  var value_right = parseValue(
    Blockly.Flowchart.valueToCode(
      block,
      "Right",
      Blockly.Flowchart.ORDER_ATOMIC
    )
  );

  var code = `(${value_left} ${getRelationalOperator(
    dropdown_operator
  )} ${value_right})`;
  return [code, Blockly.Flowchart.ORDER_NONE];
};

Blockly.Flowchart["binarylogicalexpression"] = function(block) {
  if (block.isShadow_) return null;

  var value_left = parseValue(
    Blockly.Flowchart.valueToCode(block, "Left", Blockly.Flowchart.ORDER_ATOMIC)
  );
  var dropdown_operator = block.getFieldValue("Operator");
  var value_right = parseValue(
    Blockly.Flowchart.valueToCode(
      block,
      "Right",
      Blockly.Flowchart.ORDER_ATOMIC
    )
  );

  var code = `(${value_left} ${getLogicalOperator(
    dropdown_operator
  )} ${value_right})`;

  return [code, Blockly.Flowchart.ORDER_NONE];
};

Blockly.Flowchart["unarylogicalexpression"] = function(block) {
  if (block.isShadow_) return null;

  var value_left = parseValue(
    Blockly.Flowchart.valueToCode(block, "Left", Blockly.Flowchart.ORDER_ATOMIC)
  );
  var code = `(!${value_left})`;
  return [code, Blockly.Flowchart.ORDER_NONE];
};

Blockly.Flowchart["stepexpression"] = function(block) {
  if (block.isShadow_) return null;

  var text_expression = block.getFieldValue("Expression");
  var number_stepid = block.getFieldValue("StepId");

  var code = `@${number_stepid}.${text_expression}`;

  return [code, Blockly.Flowchart.ORDER_NONE];
};

Blockly.Flowchart["literal"] = function(block) {
  if (block.isShadow_) return null;

  var text_value = block.getFieldValue("Value");
  var code = text_value;
  return [code, Blockly.Flowchart.ORDER_NONE];
};

Blockly.Flowchart["navigatelistitem"] = function(block) {
  if (block.isShadow_) return null;
  var text_title = block.getFieldValue("Title");
  var statements_targetstep = statementToArray(
    Blockly.Flowchart.statementToCode(block, "TargetStep")
  );

  addStepsToLater(statements_targetstep);

  var listItem = {
    title: text_title,
    action: "NavigateStep",
    targetStepId:
      statements_targetstep.length > 0 ? statements_targetstep[0].id : null
  };

  var code = JSON.stringify(listItem);
  return code;
};

Blockly.Flowchart["openurllistitem"] = function(block) {
  if (block.isShadow_) return null;
  var text_title = block.getFieldValue("Title");

  var listItem = {
    title: text_title,
    action: "OpenURL"
  };

  var code = JSON.stringify(listItem);
  return code;
};

Blockly.Flowchart["downloadfilelistitem"] = function(block) {
  if (block.isShadow_) return null;
  var text_title = block.getFieldValue("Title");

  var listItem = {
    title: text_title,
    action: "DownloadFile"
  };

  var code = JSON.stringify(listItem);
  return code;
};

Blockly.Flowchart["apistep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: API ${label_id}|apistep${selected}`
  );

  var apiStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(apiStep);
  return code;
};

Blockly.Flowchart["apiparameter"] = function(block) {
  return null;
};

Blockly.Flowchart["goto"] = function(block) {
  var number_id = block.getFieldValue("Id");
  var code = JSON.stringify({ id: number_id });
  return code;
};

Blockly.Flowchart["compositestep"] = function(block) {
  var parentScope = currentScope;
  var nextBlock = block.getNextBlock();

  var label_id = block.getFieldValue("Id");
  var text_name = block.getFieldValue("Name");
  currentScope = text_name;

  var statements_steps = statementToArray(
    Blockly.Flowchart.statementToCode(block, "Steps")
  );

  var steps = statements_steps;
  if (stepsToAddLater[currentScope]) {
    steps = statements_steps.concat(stepsToAddLater[currentScope].steps);
  }

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  let compositeStep = {
    id: label_id,
    name: text_name,
    steps: steps,
    rootStepId: (statements_steps.length > 0 && statements_steps[0].id) || null
  };

  currentScope = parentScope;

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>subroutine: ${label_id} ${text_name}|compositestep${selected}`
  );

  compositeStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(compositeStep);
  return code;
};

Blockly.Flowchart["faqstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: FAQ ${label_id}|faqstep${selected}`
  );

  var faqStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(faqStep);
  return code;
};

Blockly.Flowchart["faqsettings"] = function(block) {
  return null;
};

Blockly.Flowchart["mapsstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: Maps ${label_id}|mapsstep${selected}`
  );

  var apiStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(apiStep);
  return code;
};

Blockly.Flowchart["locationsource"] = function(block) {
  var text_name = block.getFieldValue("Name");
  var text_latitude = block.getFieldValue("Latitude");
  var text_longitude = block.getFieldValue("Longitude");
  var text_zipcode = block.getFieldValue("ZipCode");
  var text_address = block.getFieldValue("Address");
  var text_state = block.getFieldValue("State");
  var text_city = block.getFieldValue("City");

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

Blockly.Flowchart["switchstep"] = function(block) {
  var text_input = block.getFieldValue("Input");
  var statements_cases = statementToArray(
    Blockly.Flowchart.statementToCode(block, "Cases")
  );
  var label_id = block.getFieldValue("Id");

  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  for (var i = 0; i < statements_cases.length; i++) {
    if (i > 0) {
      flowchartDeclarations.push(
        `step${label_id}i${i +
          1}=>parallel: Switch ${text_input} ${label_id} \r\n Case ${
          statements_cases[i].value
        }|switchstep${selected}`
      );
      if (i > 1) {
        flowchartConnections.push(
          `step${label_id}i${i}(path2, right)->step${label_id}i${i + 1}`
        );
        flowchartConnections.push(
          `step${label_id}i${i}@>step${label_id}i${i + 1}({"stroke": "${
            selected ? "yellow" : "#a5935b"
          }", "arrow-end": "none"})`
        );
        flowchartConnections.push(
          `step${label_id}i${i + 1}(path1, bottom)->step${
            statements_cases[i].targetStepId
          }`
        );
      } else {
        flowchartConnections.push(
          `step${label_id}(path2, right)->step${label_id}i${i + 1}`
        );
        flowchartConnections.push(
          `step${label_id}@>step${label_id}i${i + 1}({"stroke": "${
            selected ? "yellow" : "#a5935b"
          }", "arrow-end": "none"})`
        );
        flowchartConnections.push(
          `step${label_id}i${i + 1}(path1, bottom)->step${
            statements_cases[i].targetStepId
          }`
        );
      }
    } else {
      flowchartDeclarations.push(
        `step${label_id}=>parallel: Switch ${text_input} ${label_id} \r\n Case ${statements_cases[i].value}|switchstep${selected}`
      );
      flowchartConnections.push(
        `step${label_id}(path1, bottom)->step${statements_cases[i].targetStepId}`
      );
    }
  }

  if (nextBlock) {
    var nextBlockId = nextBlock.getFieldValue("Id");
    if (statements_cases.length === 0) {
      flowchartDeclarations.push(
        `step${label_id}=>parallel: Switch ${text_input} ${label_id} \r\n Else|switchstep${selected}`
      );
      flowchartConnections.push(
        `step${label_id}(path1, bottom)->step${nextBlockId}`
      );
    } else {
      flowchartDeclarations.push(
        `step${label_id}i${statements_cases.length +
          1}=>parallel: Switch ${text_input} ${label_id} \r\n Else|switchstep${selected}`
      );
      if (statements_cases.length > 1) {
        flowchartConnections.push(
          `step${label_id}i${
            statements_cases.length
          }(path2, right)->step${label_id}i${statements_cases.length + 1}`
        );
        flowchartConnections.push(
          `step${label_id}i${
            statements_cases.length
          }@>step${label_id}i${statements_cases.length + 1}({"stroke": "${
            selected ? "yellow" : "#a5935b"
          }"})`
        );
      } else {
        flowchartConnections.push(
          `step${label_id}(path2, right)->step${label_id}i${statements_cases.length +
            1}`
        );
        flowchartConnections.push(
          `step${label_id}@>step${label_id}i${statements_cases.length +
            1}({"stroke": "${selected ? "yellow" : "#a5935b"}"})`
        );
      }
      flowchartConnections.push(
        `step${label_id}i${statements_cases.length +
          1}(path1, bottom)->step${nextBlockId}`
      );
    }
  } else if (statements_cases.length === 0) {
    flowchartDeclarations.push(
      `step${label_id}=>parallel: Switch ${text_input} ${label_id}|switchstep${selected}`
    );
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}(path1)->e${label_id}`);
  }

  var switchStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(switchStep);
  return code;
};

Blockly.Flowchart["case"] = function(block) {
  var text_value = block.getFieldValue("Value");
  var statements_targetstep = statementToArray(
    Blockly.Flowchart.statementToCode(block, "TargetStep")
  );

  addStepsToLater(statements_targetstep);

  var $case = {
    value: text_value,
    targetStepId:
      statements_targetstep.length > 0 ? statements_targetstep[0].id : null
  };

  var code = JSON.stringify($case);
  return code;
};

Blockly.Flowchart["imageclassificationstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: Image classification ${label_id}|imageclassificationstep${selected}`
  );

  var imageClassificationStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(imageClassificationStep);
  return code;
};

Blockly.Flowchart["imageclassificationsettings"] = function(block) {
  return null;
};

Blockly.Flowchart["readgpslocationstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: GPS Location ${label_id}|readgpslocationstep${selected}`
  );

  var readGpsLocationStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(readGpsLocationStep);
  return code;
};

Blockly.Flowchart["transformstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: Transformation ${label_id}|transformstep${selected}`
  );

  var transformStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(transformStep);
  return code;
};

Blockly.Flowchart["handoffstep"] = function(block) {
  var label_id = block.getFieldValue("Id");
  var nextBlock = block.getNextBlock();

  var flowchartConnections = [];
  var flowchartDeclarations = [];

  if (!nextBlock) {
    flowchartDeclarations.push(`e${label_id}=>end: End`);
    flowchartConnections.push(`step${label_id}->e${label_id}`);
  } else {
    var nextBlockId = nextBlock.getFieldValue("Id");
    flowchartConnections.push(`step${label_id}->step${nextBlockId}`);
  }

  var selected = Blockly.Flowchart.SelectedId === label_id ? "selected" : "";

  flowchartDeclarations.push(
    `step${label_id}=>operation: Hand off ${label_id}|handoffstep${selected}`
  );

  var transformStep = {
    id: label_id,
    flowchartDeclarations,
    flowchartConnections
  };

  var code = JSON.stringify(transformStep);
  return code;
};

Blockly.Flowchart["simplemessagestep"] = function(block) {
  return Blockly.Flowchart["messagestep"](block);
};

Blockly.Flowchart["simpleinputstep"] = function(block) {
  return Blockly.Flowchart["inputstep"](block);
};

Blockly.Flowchart["simpleconfirmstep"] = function(block) {
  return Blockly.Flowchart["confirmstep"](block);
};

Blockly.Flowchart["simpleliststep"] = function(block) {
  return Blockly.Flowchart["liststep"](block);
};

Blockly.Flowchart["simplelistitem"] = function(block) {
  if (block.isShadow_) return null;
  var text_title = block.getFieldValue("Title");
  var statements_targetstep = statementToArray(
    Blockly.Flowchart.statementToCode(block, "TargetStep")
  );

  addStepsToLater(statements_targetstep);

  var listItem = {
    title: text_title,
    action: "NavigateStep",
    targetStepId:
      statements_targetstep.length > 0 ? statements_targetstep[0].id : null
  };

  var code = JSON.stringify(listItem);
  return code;
};

Blockly.Flowchart["transformation"] = function(block) {
  return null;
};
