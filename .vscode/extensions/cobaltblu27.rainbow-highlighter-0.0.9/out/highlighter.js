"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
//TODO add options
class DecoratorClass {
    constructor() {
        this.decorationVarList = {};
        this.config = vscode.workspace.getConfiguration("rainbow-highlighter");
        this.buildColor = (color) => {
            const putAlpha = (c) => {
                const colorVal = c.match(/\((.+)\)/)[1];
                return `rgba(${colorVal}, ${this.config["background-alpha"]})`;
            };
            return {
                backgroundColor: this.config["use-border"] ? undefined : putAlpha(color),
                border: this.config["use-border"] ? `2px solid ${color}` : undefined,
                overviewRulerColor: color
            };
        };
        this.colorPalette = vscode.workspace
            .getConfiguration("rainbow-highlighter")["palette"].map((color) => {
            return (varName) => {
                const decoration = vscode.window.createTextEditorDecorationType(this.buildColor(color));
                this.decorationVarList[varName] = decoration;
                return decoration;
            };
        });
        this.decorationIndex = 0;
        this.getIndex = () => {
            const i = this.decorationIndex;
            this.decorationIndex = i >= this.colorPalette.length - 1 ? 0 : i + 1;
            return i;
        };
        this.resetIndex = () => {
            this.decorationIndex = 0;
        };
    }
    DecoratorClass() { }
    removeHighlight(editor, key) {
        const decoration = this.decorationVarList[key];
        if (decoration) {
            editor.setDecorations(decoration, []);
        }
    }
    clearVariable(key) {
        this.decorationVarList[key] = undefined;
    }
    removeHighlights(editor) {
        Object.keys(this.decorationVarList)
            .map(k => this.decorationVarList[k])
            .filter(d => d)
            .forEach(d => editor.setDecorations(d, []));
        this.decorationVarList = {};
        this.resetIndex();
    }
    highlightRange(editor, range, key, index) {
        const colorIndex = index !== undefined ? index : this.getIndex();
        let decoration = this.decorationVarList[key];
        if (decoration === undefined) {
            decoration = this.colorPalette[colorIndex](key);
        }
        editor.setDecorations(decoration, range);
        return colorIndex;
    }
}
//use with Decorator.getInstance(); This will return decorator singleton.
exports.Decorator = (function () {
    let instance;
    function createInstance() {
        return new DecoratorClass();
    }
    return {
        getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
//# sourceMappingURL=highlighter.js.map