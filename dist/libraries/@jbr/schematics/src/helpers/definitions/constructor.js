"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConstructor = void 0;
const parameter_1 = require("./parameter");
function getConstructor(node, sourceFile) {
    return {
        parameters: node.parameters.map(param => (0, parameter_1.getParameter)(param, sourceFile))
    };
}
exports.getConstructor = getConstructor;
//# sourceMappingURL=constructor.js.map