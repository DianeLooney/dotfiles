"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const util_1 = require("util");
const path_1 = require("path");
const shelljs_1 = require("shelljs");
const vscode = require("vscode");
const welcome = `Clojure Lint extension loaded.
Please report any issues to https://github.com/marcomorain/clojure-lint/issues`;
const install = `clj-kondo was not found on the path. Please install it following the instructions
located here: https://github.com/borkdude/clj-kondo/blob/master/doc/install.md"`;
const bug = `An unexpected error occured when running clj-kondo. Please report a bug
to https://github.com/marcomorain/clojure-lint/issues`;
function lint(fileName, workingDir, onSuccess, needInstall, otherProblem) {
    const command = shelljs_1.which('clj-kondo');
    if (!command) {
        return needInstall();
    }
    const args = ['--config', '{:output {:format :json}}', '--lint', fileName];
    child_process_1.execFile(command.toString(), args, { cwd: workingDir }, (err, stdout, _stderr) => {
        // error can be an `ExecException` or an `Error`.
        // In those cases, code is a string or a number, depending on the type.
        let error = err;
        // Kondo exits with 2 or 3 if there were findings.
        if (!error || error.code === 2 || error.code === 3) {
            try {
                const results = JSON.parse(stdout);
                return onSuccess(results);
            }
            catch (error) {
                return otherProblem(error);
            }
        }
        if (error.code === "ENOENT") {
            return needInstall();
        }
        return otherProblem(error);
    });
}
function severity(level) {
    switch (level) {
        case "error": return vscode.DiagnosticSeverity.Error;
        case "warning": return vscode.DiagnosticSeverity.Warning;
        case "info": return vscode.DiagnosticSeverity.Information;
    }
    return vscode.DiagnosticSeverity.Information;
}
function range(finding) {
    // clj-kondo can report errors on line 0 col 0 when there is an unexpected
    // error linting.
    let row = Math.max(0, finding.row - 1);
    return new vscode.Range(row, finding.col, row, finding.col);
}
function toDiagnostic(finding) {
    return {
        message: finding.message,
        severity: severity(finding.level),
        range: range(finding)
    };
}
function workspaceDirectory(doc) {
    const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
    if (folder) {
        return folder.uri.fsPath;
    }
    return path_1.dirname(doc.uri.fsPath);
}
function listener(channel, diagnostics, needInstall) {
    return __awaiter(this, void 0, void 0, function* () {
        const ed = vscode.window.activeTextEditor;
        if (!ed) {
            return;
        }
        const doc = ed.document;
        if (!doc) {
            return;
        }
        const { languageId, fileName } = doc;
        if (languageId !== 'clojure') {
            return;
        }
        const workingDir = workspaceDirectory(doc);
        lint(fileName, workingDir, (results) => {
            diagnostics.set(doc.uri, results.findings.map(toDiagnostic));
            channel.appendLine(`Linted ${fileName}: ${results.summary.error} errors, ${results.summary.warning} warnings`);
        }, needInstall, (error) => {
            channel.appendLine(bug);
            channel.appendLine(util_1.inspect(error));
            diagnostics.delete(doc.uri);
            channel.show(true);
        });
    });
}
function activate(context) {
    const channel = vscode.window.createOutputChannel('Clojure Lint');
    channel.appendLine(welcome);
    let diagnostics = vscode.languages.createDiagnosticCollection('clojure');
    context.subscriptions.push(diagnostics);
    // If clj-kondo cannot be found, we only want to warn the user once.
    // Use a promise, which can only be resolved once to get a functional method
    // to only call a function once.
    let showInstallMessage = new Promise(function (resolve, _reject) {
        vscode.workspace.onDidSaveTextDocument(() => {
            listener(channel, diagnostics, resolve);
        });
    }).then(() => {
        channel.appendLine(install);
        channel.show(true);
    });
}
exports.activate = activate;
function deactivate() {
    console.log("clojure-lint deactivated");
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map