"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertyDeclaration = void 0;
const utilities_1 = require("../utilities");
const modifiers_1 = require("./modifiers");
function getPropertyDeclaration(node, sourceFile) {
    const name = (0, utilities_1.getText)(node.name, sourceFile), modifiers = (0, modifiers_1.getModifiers)(node, sourceFile);
    return {
        name,
        modifiers,
        signature: getPropertySignature(name, modifiers),
        type: node.type ? (0, utilities_1.getText)(node.type, sourceFile) : undefined,
        optional: !!node.questionToken,
        exclamation: !!node.exclamationToken,
        initializedValue: node.initializer ? (0, utilities_1.getText)(node.initializer, sourceFile) : undefined,
        raw: node.getText(sourceFile)
    };
}
exports.getPropertyDeclaration = getPropertyDeclaration;
function getPropertySignature(name, modifiers) {
    const decorators = (0, modifiers_1.getDecoratorsAsString)(modifiers), keywords = (0, modifiers_1.getKeywordsAsString)(modifiers);
    return `${decorators}${keywords}${name}`;
}
//# sourceMappingURL=property.js.map