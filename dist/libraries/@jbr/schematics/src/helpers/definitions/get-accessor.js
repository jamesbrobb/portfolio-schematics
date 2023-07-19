"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGetAccessorDeclaration = void 0;
const modifiers_1 = require("./modifiers");
const utilities_1 = require("../utilities");
function getGetAccessorDeclaration(node, sourceFile) {
    return {
        name: (0, utilities_1.getText)(node.name, sourceFile),
        type: node.type ? (0, utilities_1.getText)(node.type, sourceFile) : undefined,
        modifiers: (0, modifiers_1.getModifiers)(node, sourceFile)
    };
}
exports.getGetAccessorDeclaration = getGetAccessorDeclaration;
//# sourceMappingURL=get-accessor.js.map