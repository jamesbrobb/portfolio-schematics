"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetAccessorDeclaration = void 0;
const utilities_1 = require("../utilities");
const modifiers_1 = require("./modifiers");
const parameter_1 = require("./parameter");
function getSetAccessorDeclaration(node, sourceFile) {
    return {
        name: (0, utilities_1.getText)(node.name, sourceFile),
        type: node.type ? (0, utilities_1.getText)(node.type, sourceFile) : undefined,
        parameters: node.parameters.map(param => (0, parameter_1.getParameter)(param, sourceFile)),
        modifiers: (0, modifiers_1.getModifiers)(node, sourceFile)
    };
}
exports.getSetAccessorDeclaration = getSetAccessorDeclaration;
//# sourceMappingURL=set-accessor.js.map