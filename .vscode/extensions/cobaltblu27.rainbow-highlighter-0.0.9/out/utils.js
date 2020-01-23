"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
exports.getVarRangeList = (editor, name) => {
    const getAllIndexes = (str, substr) => {
        var indexes = [], i = -1;
        while ((i = str.indexOf(substr, i)) !== -1) {
            indexes.push(i);
            i = i + substr.length;
        }
        return indexes;
    };
    const textByLines = editor.document.getText().split("\n");
    let ranges = [];
    for (let i = 0; i < textByLines.length; i++) {
        const indexArr = getAllIndexes(textByLines[i], name)
            .map(j => {
            const position = new vscode.Position(i, j);
            return editor.document.getWordRangeAtPosition(position);
        })
            .filter(range => range && editor.document.getText(range) === name)
            .map(range => {
            if (range) {
                ranges.push(range);
            }
        });
    }
    return ranges;
};
exports.log = vscode.window.showInformationMessage;
//# sourceMappingURL=utils.js.map