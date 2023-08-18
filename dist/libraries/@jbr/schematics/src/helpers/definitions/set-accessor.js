"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetAccessorDeclaration = void 0;
const modifiers_1 = require("./modifiers");
const parameter_1 = require("./parameter");
const utils_1 = require("../utils");
function getSetAccessorDeclaration(node, sourceFile) {
    const modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {};
    return Object.assign({ kind: 'setter', name: (0, utils_1.getText)(node.name, sourceFile), type: node.type ? (0, utils_1.getText)(node.type, sourceFile) : undefined, parameters: node.parameters.map(param => (0, parameter_1.getParameter)(param, sourceFile)) }, modifiers);
}
exports.getSetAccessorDeclaration = getSetAccessorDeclaration;
//# sourceMappingURL=set-accessor.js.map