"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVariableDeclaration = void 0;
const utils_1 = require("../utils");
function getVariableDeclaration(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), type = node.type ? (0, utils_1.getText)(node.type, sourceFile) : undefined, exclamationToken = node.exclamationToken ? (0, utils_1.getText)(node.exclamationToken, sourceFile) : undefined, initializer = node.initializer ? (0, utils_1.getText)(node.initializer, sourceFile) : undefined;
    return {
        kind: 'variableDeclaration',
        name,
        type,
        exclamationToken,
        initializer,
        raw: node.getText(sourceFile)
    };
}
exports.getVariableDeclaration = getVariableDeclaration;
//# sourceMappingURL=variable.js.map