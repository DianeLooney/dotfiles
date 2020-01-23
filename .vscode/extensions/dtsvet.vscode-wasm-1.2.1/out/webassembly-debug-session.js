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
const vscode = require("vscode");
const vscode_1 = require("vscode");
const events_1 = require("events");
const utils_1 = require("./utils");
const wasmNamespace = '<node_internals>/wasm:';
class WebAssemblyDebugSession extends events_1.EventEmitter {
    constructor(session) {
        super();
        this._session = session;
        this._wasmSources = [];
        this._customEvent = vscode.debug.onDidReceiveDebugSessionCustomEvent((event) => {
            if (event.session.id !== this._session.id) {
                return;
            }
            this.emit(event.event, event.body);
        });
        // TODO: move `500` to config
        this._loadSourcesComplete = new utils_1.SubscribeComplete(500);
        this._loadSourcesComplete.once('complete', (sources) => {
            const filter = (source) => source.path.startsWith(wasmNamespace);
            this._wasmSources = sources.filter(filter);
            if (this._wasmSources.length > 0) {
                this.emit('wasm:sources', this.sources);
            }
            else {
                this.emit('error', new Error('Not found wasm files'));
            }
        });
        this.on('loadedSource', (body) => {
            if (body.reason !== 'new') {
                return;
            }
            this._loadSourcesComplete.process(body.source);
        });
    }
    get sources() {
        return Object.freeze(this._wasmSources);
    }
    openFile(source) {
        return __awaiter(this, void 0, void 0, function* () {
            const uri = vscode_1.Uri.parse(`wasm-debug:${source.path}.wat?session=${vscode.debug.activeDebugSession.id}`);
            const document = yield vscode.workspace.openTextDocument(uri);
            const editor = yield vscode.window.showTextDocument(document);
            return editor;
        });
    }
    dispose() {
        this._customEvent.dispose();
        this._loadSourcesComplete.dispose();
    }
}
exports.default = WebAssemblyDebugSession;
//# sourceMappingURL=webassembly-debug-session.js.map