"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGetAccessorDeclaration = void 0;
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
function getGetAccessorDeclaration(node, sourceFile) {
    const modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {};
    return Object.assign({ kind: 'getter', name: (0, utils_1.getText)(node.name, sourceFile), type: node.type ? (0, utils_1.getText)(node.type, sourceFile) : undefined }, modifiers);
}
exports.getGetAccessorDeclaration = getGetAccessorDeclaration;
//# sourceMappingURL=get-accessor.js.map