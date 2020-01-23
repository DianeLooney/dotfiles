'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const namespace = 'wasm-debug';
/**
 * This class helps to open WebAssembly files.
 */
class WebAssemblyDebugContentProvider {
    provideTextDocumentContent(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            const filepath = uri.path.replace(/\.was?t$/, '');
            const file = uri.with({ scheme: 'debug', path: filepath });
            const document = yield vscode_1.workspace.openTextDocument(file);
            return document.getText();
        });
    }
}
exports.default = WebAssemblyDebugContentProvider;
//# sourceMappingURL=webassembly-debug-content-provider.js.map