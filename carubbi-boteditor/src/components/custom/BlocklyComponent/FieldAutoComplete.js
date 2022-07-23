import * as Blockly from 'blockly/core';
import JsonBotDefinition from "./codeGenerator.js";


export class FieldAutoComplete extends Blockly.FieldTextInput {
    constructor(value = undefined, validator = undefined, config = undefined) {

        super(value, validator);
        this.timer = null;
        this.boundEvents_ = [];

        this.serviceUrl = config.serviceUrl || `${process.env.REACT_APP_API_BOT_ENGINE_URL}/api/botRuntime/intellisense?term=`;
    }

    debounce(func, timeout = 500) {

        return (...args) => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    static fromJson(options) {
        return new FieldAutoComplete(
            options['value'], undefined, options);
    }

    showInlineEditor_(quietInput) {
        super.showInlineEditor_(quietInput);
        this.boundEvents_.push(Blockly.browserEvents.conditionalBind(this.htmlInput_, 'input', this, this.onAutoCompleteChange_));
    }

    onAutoCompleteChange_(e) {
        this.debounce(() => {
            this.showSuggestions(e.target.oldValue_);
        })();
    }

    async fetchSuggestions(term) {
        const botConfig = JsonBotDefinition.fromWorkspace(this.workspace_);
        const request = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            cache: 'default',
            body: botConfig
        };
        const curlyBracesRegexExpression = /[^{}]+(?=})/g;
        const curlyBranesRegexInclusiveExpression = /\{([^}]+)\}/g;

        const fieldNames = this.serviceUrl.match(curlyBracesRegexExpression);

        const params = Array.isArray(fieldNames)
            ? Object.assign({}, ...this.serviceUrl.match(curlyBracesRegexExpression).map(fieldName => ({ [fieldName]: this.sourceBlock_.getFieldValue(fieldName) })))
            : {};

        const serviceUrl = this.serviceUrl.replace(curlyBranesRegexInclusiveExpression, fieldName => params[fieldName.substring(1, fieldName.length - 1)]);
        try {
            const response = await fetch(`${serviceUrl}${term}`, request)

            return response.status === 200 ? await response.json() : [];
        } catch {
            return [];
        }
    }

    async showSuggestions(term) {
        Blockly.DropDownDiv.getContentDiv().innerHTML = null;
        const results = await this.fetchSuggestions(term);

        if (results.length > 0) {
            const editor = this.dropdownCreate_([...new Set(results)]);

            Blockly.DropDownDiv.getContentDiv().appendChild(editor);

            Blockly.DropDownDiv.setColour(
                this.sourceBlock_.style.colourPrimary,
                this.sourceBlock_.style.colourTertiary);

            Blockly.DropDownDiv.showPositionedByField(
                this, this.dropdownDispose_.bind(this));
        }
    }

    dropdownDispose_() {
        Blockly.DropDownDiv.getContentDiv().innerHTML = null;
    }

    dropdownCreate_(results) {
        const wrapper = document.createElement('div');
        wrapper.className = 'fieldAutocompleteContainer';

        results.forEach(result => {
            const item = document.createElement('div');
            item.className = "fieldAutoComplete";
            item.innerText = result
            Blockly.browserEvents.bind(item, 'click', this, this.onSuggestionAccepted_)
            wrapper.appendChild(item);
        })


        return wrapper;
    }

    onSuggestionAccepted_(e) {
        this.setEditorValue_(this.htmlInput_.value + e.target.innerText);
        Blockly.WidgetDiv.hide();
        Blockly.DropDownDiv.hideIfOwner(this);
    }
}




Blockly.fieldRegistry.register('field_autocomplete', FieldAutoComplete);

Blockly.Css.register(
    /* eslint-disable indent */
    `.fieldAutoCompleteContainer {
        align-items: center;
        display: flex;
        height: 32px;
        justify-content: center;
        width: 150px;
      }
      .fieldAutoComplete {
        color: white;
        -webkit-appearance: none;
        background: transparent; /* override white in chrome */
        margin: 4px;
        padding: 0;
        width: auto;
        cursor:pointer;
        padding: 5px;
        border: solid transparent 1px;
      }
      .fieldAutoComplete:focus {
        outline: none;
      }
      .fieldAutoComplete:hover {
        border: solid white 1px;
      }
     `
    /* eslint-enable indent */
);