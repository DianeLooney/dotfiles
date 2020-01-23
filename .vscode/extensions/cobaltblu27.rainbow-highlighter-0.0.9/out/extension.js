"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const highlighter_1 = require("./highlighter");
const utils_1 = require("./utils");
function activate(context) {
    let highlightList = [];
    let colorMap = {};
    const decorator = highlighter_1.Decorator.getInstance();
    const highlightOn = (editor, variable) => {
        if (highlightList.indexOf(variable) < 0) {
            highlightList.push(variable);
        }
        const rangeList = utils_1.getVarRangeList(editor, variable);
        const color = variable in colorMap ? colorMap[variable] : undefined;
        colorMap[variable] = decorator.highlightRange(editor, rangeList, variable, color);
    };
    const highlightOff = (editor, variable) => {
        highlightList = highlightList.filter(x => x !== variable);
        decorator.removeHighlight(editor, variable);
    };
    const toggleHighlight = () => {
        const currentEditor = vscode.window.activeTextEditor;
        if (!currentEditor) {
            return;
        }
        const selection = currentEditor.selection;
        //const regex = /[\d\w_]+/;
        const regex = undefined;
        const range = currentEditor.document.getWordRangeAtPosition(selection.anchor, regex);
        if (!range) {
            return;
        }
        const selectedText = currentEditor.document.getText(range);
        const turnOff = highlightList.indexOf(selectedText) > -1;
        vscode.window.visibleTextEditors.forEach(editor => {
            if (turnOff) {
                highlightOff(editor, selectedText);
            }
            else {
                highlightOn(editor, selectedText);
            }
        });
        if (turnOff) {
            delete colorMap[selectedText];
            decorator.clearVariable(selectedText);
        }
    };
    const removeAllHighlight = () => {
        highlightList = [];
        colorMap = {};
        vscode.window.visibleTextEditors.forEach(editor => {
            decorator.removeHighlights(editor);
        });
    };
    context.subscriptions.push(vscode.commands.registerCommand("rainbow-highlighter.toggleHighlight", toggleHighlight));
    const renewHighlight = (editors) => {
        editors.forEach(editor => {
            highlightList.forEach(text => {
                const rangeList = utils_1.getVarRangeList(editor, text);
                const color = text in colorMap ? colorMap[text] : undefined;
                colorMap[text] = decorator.highlightRange(editor, rangeList, text, color);
            });
        });
    };
    const updateHighlight = (e) => {
        vscode.window.visibleTextEditors.forEach(editor => {
            if (editor.document === e.document) {
                highlightList.forEach(v => {
                    decorator.removeHighlight(editor, v);
                });
            }
        });
        vscode.window.visibleTextEditors.forEach(editor => {
            if (editor.document === e.document) {
                highlightList.forEach(v => {
                    highlightOn(editor, v);
                });
            }
        });
    };
    context.subscriptions.push(vscode.commands.registerCommand("rainbow-highlighter.removeHighlight", removeAllHighlight));
    vscode.window.onDidChangeVisibleTextEditors(renewHighlight, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument(updateHighlight);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map