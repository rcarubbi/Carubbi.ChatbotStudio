Blockly.InitializeApp = (function (mediaUrl) {
    var _workspace = null,
        _toolbox = document.getElementById("toolbox"),
        _wsOptions = {
            toolbox: _toolbox,
            collapse: true,
            comments: true,
            disable: false,
            maxBlocks: Infinity,
            trashcan: true,
            media: mediaUrl,
            horizontalLayout: false,
            toolboxPosition: 'start',
            css: true,
            rtl: false,
            scrollbars: true,
            sounds: true,
            oneBasedIndex: true,
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
            toogleInputMode: false,
        },
        _chart,
        _canvas = document.getElementById("canvas"),
        _blocklyArea = document.getElementById('blocklyArea'),
        _blocklyDiv = document.getElementById('blocklyDiv');

    function overrideContextMenu() {
        var originalBlocklyContextMenuPopulate = Blockly.ContextMenu.populate_;

        Blockly.ContextMenu.populate_ = function (options, rtl) {
            var menu = originalBlocklyContextMenuPopulate(_wsOptions.toogleInputMode
                ? options
                : options.filter(x => x.text !== Blockly.Msg["INLINE_INPUTS"] && x.text !== Blockly.Msg["EXTERNAL_INPUTS"]), rtl);
            return menu;
        };
    }

    function initializeWorkspace() {
       
        _workspace = Blockly.inject(_blocklyDiv, _wsOptions);

        _workspace.addChangeListener(onStepCreated);

        window.addEventListener('resize', onResize, false);
        onResize();

        Blockly.svgResize(_workspace);
        Blockly.Xml.domToWorkspace(workspaceBlocks, _workspace);
    }

    function onResize() {
        _blocklyDiv.style.width = _blocklyArea.offsetWidth + 'px';
        _blocklyDiv.style.height = _blocklyArea.offsetHeight + 'px';
        _canvas.style.width = _blocklyArea.offsetWidth + 'px';
        _canvas.style.height = _blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(_workspace);
    }

    function onStepCreated(event) {
        var block = _workspace.getBlockById(event.blockId || event.newValue);

        if (event.type === Blockly.Events.BLOCK_CREATE) {
            setBlockId(block);
        }

        if (event.type === Blockly.Events.UI || event.type === Blockly.Events.BLOCK_MOVE) {
            if (block) Blockly.Flowchart.SelectedId = block.getFieldValue("Id");
        }
        updateFlowchart();

    }

    function setBlockId(block) {
           
        if (block.type === 'goto') return;

        var id = block.getField("Id");
        if (id) {
            block.setFieldValue(getNextStepBlockId(), "Id");
        }

        for (var i = 0; i < block.childBlocks_.length; i++) {
            setBlockId(block.childBlocks_[i]);
        }
    }

    function generateJson() {
        document.getElementById('jsonoutput').innerText = Blockly.JsonBotDefinition.fromWorkspace(_workspace);
    };

    function generateFlowchart() {
        return Blockly.Flowchart.fromWorkspace(_workspace);
    }

    function saveBlocks() {
        var xml = Blockly.Xml.workspaceToDom(_workspace);
        var xml_text = Blockly.Xml.domToText(xml);
        document.getElementById('blocksxml').value = xml_text;
    }

    function loadBlocks() {
        var xml_text = document.getElementById('blocksxml').value;
        _workspace.clear();
        _workspace.removeChangeListener(onStepCreated);
        _workspace.addChangeListener(onBlockLoaded);
        var xml = Blockly.Xml.textToDom(xml_text);
        Blockly.Xml.domToWorkspace(xml, _workspace);
    }

    function onBlockLoaded(event) {
        if (event.type === Blockly.Events.BLOCK_CREATE) {
            collapseStepBlocks();
            _workspace.scrollCenter();
            _workspace.removeChangeListener(onBlockLoaded);
            _workspace.addChangeListener(onStepCreated);
        }
    }

    function getStepBlocks() {
        var blocks = Object.values(_workspace.blockDB_);
        var stepBlocks = blocks.filter(x => x.getFieldValue("Id"));
        return stepBlocks;
    }

    function getNextStepBlockId() {
        var blockIds = getStepBlocks().map(x => parseInt(x.getFieldValue("Id")));
        return (max(blockIds) || 0) + 1;
    }

    function collapseStepBlocks() {
        getStepBlocks().map(b => { b.setCollapsed(true); });
    }

    function getStepBlockById(id) {
        return getStepBlocks().filter(b => b.getFieldValue("Id") === id)[0];
    }

    function updateFlowchart() {
        try {
            if (_chart) _chart.clean();
        } catch { }
        var code = generateFlowchart();
        _chart = flowchart.parse(code);
        _chart.drawSVG('canvas', {
            'line-width': 2,
            'line-length': 25,
            'text-margin': 10,
            'font-size': 14,
            'font': 'normal',
            'font-family': 'Helvetica',
            'font-weight': 'normal',
            'font-color': 'black',
            'line-color': 'black',
            'element-color': 'black',
            'fill': 'black',
            'yes-text': 'sim',
            'no-text': 'não',
            'arrow-end': 'block',
            'scale': 1,
            'symbols': {
                'start': {
                    'font-color': 'white',
                    'fill': '#5B5BA5'
                },
                'end': {
                    'border-radius': '5px',
                    'font-color': 'white',
                    'fill': 'black'
                }
            },
            'flowstate': {
                'messagestep': {
                    'fill': '#80A55B',
                    'font-color': 'white',
                },
                'messagestepselected': {
                    'fill': '#80A55B',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'inputstep': {
                    'fill': '#5BA5A5',
                    'font-color': 'white',
                },
                'inputstepselected': {
                    'fill': '#5BA5A5',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'formstep': {
                    'fill': '#5ba582',
                    'font-color': 'white',
                },
                'formstepselected': {
                    'fill': '#5ba582',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'confirmstep': {
                    'font-color': 'white',
                    'fill': '#805BA5',
                },
                'confirmstepselected': {
                    'fill': '#805BA5',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'liststep': {
                    'fill': '#a5935b',
                    'font-color': 'white',
                },
                'liststepselected': {
                    'fill': '#a5935b',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'conditionstep': {
                    'fill': '#5b5ba5',
                    'font-color': 'white',
                },
                'conditionstepselected': {
                    'fill': '#5b5ba5',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'apistep': {
                    'fill': '#80a55b',
                    'font-color': 'white',
                },
                'apistepselected': {
                    'fill': '#80a55b',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'compositestep': {
                    'fill': '#A55B80',
                    'font-color': 'white',
                },
                'compositestepselected': {
                    'fill': '#A55B80',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'faqstep': {
                    'fill': '#A5805B',
                    'font-color': 'white',
                },
                'faqstepselected': {
                    'fill': '#A5805B',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'mapsstep': {
                    'fill': '#5BA55B',
                    'font-color': 'white',
                },
                'mapsstepselected': {
                    'fill': '#5BA55B',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'switchstep': {
                    'fill': '#a5935b',
                    'font-color': 'white',
                },
                'switchstepselected': {
                    'fill': '#a5935b',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'readgpslocationstep': {
                    'fill': '#5ba5a5',
                    'font-color': 'white',
                },
                'readgpslocationstepselected': {
                    'fill': '#5ba5a5',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'imageclassificationstep': {
                    'fill': '#805ba5',
                    'font-color': 'white',
                },
                'imageclassificationstepselected': {
                    'fill': '#805ba5',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },
                'transformstep': {
                    'fill': '#a55ba5',
                    'font-color': 'white',
                },
                'transformstepselected': {
                    'fill': '#a55ba5',
                    'element-color': 'yellow',
                    'font-color': 'white',
                },

            }
        });

        if (localStorage.scrollTop) {
            _canvas.scroll(localStorage.scrollLeft, localStorage.scrollTop);
        }

        $(".flowchart").on("click", onFlowchartNodeClicked);
    }

    function onFlowchartNodeClicked(e, node) {
        var scrollTop = _canvas.scrollTop;
        var scrollLeft = _canvas.scrollLeft;
        localStorage.setItem("scrollTop", scrollTop);
        localStorage.setItem("scrollLeft", scrollLeft);

        var blockId = (node && node.key) || e.target.id;
        var id = blockId.replace("step", "").split('i')[0];
        collapseStepBlocks();

        var block = getStepBlockById(id);
        if (block) {
            block.select();
            var blockToExpand = block;
            do {
                blockToExpand.setCollapsed(false);
                blockToExpand = blockToExpand.getSurroundParent();
            } while (blockToExpand);
            scrollToBlock(block);
        } else {
            _workspace.scrollCenter();
        }
    }

    function scrollToBlock(block) {
        var xy = block.getRelativeToSurfaceXY();
        var m = _workspace.getMetrics();
        _workspace.scrollbar.set(xy.x * _workspace.scale - m.contentLeft - m.viewWidth * 0.2, xy.y * _workspace.scale - m.contentTop - m.viewHeight * 0.3);

    }

    function max(items) {
        return items.reduce((acc, val) => {
            acc = (acc === undefined || val > acc) ? val : acc
            return acc;
        }, 0);
    }

    initializeWorkspace();
    overrideContextMenu();

    return {
        generateJson,
        saveBlocks,
        loadBlocks,
        onFlowchartNodeClicked
    };
})


