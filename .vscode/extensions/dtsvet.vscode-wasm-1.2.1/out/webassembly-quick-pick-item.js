"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WebAssemblyFunctionQuickPickItem {
    constructor(source) {
        this.source = source;
        this.label = source.name;
        this.description = source.path;
    }
}
exports.default = WebAssemblyFunctionQuickPickItem;
//# sourceMappingURL=webassembly-quick-pick-item.js.map