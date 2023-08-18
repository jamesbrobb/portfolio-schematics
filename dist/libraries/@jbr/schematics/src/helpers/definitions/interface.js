"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInterfaceDeclaration = void 0;
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
function getInterfaceDeclaration(node, sourceFile) {
    const modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {};
    return Object.assign({ kind: 'interface', name: (0, utils_1.getText)(node.name, sourceFile) }, modifiers);
}
exports.getInterfaceDeclaration = getInterfaceDeclaration;
//# sourceMappingURL=interface.js.map