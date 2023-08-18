"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPropertySignature = exports.getPropertyDeclaration = void 0;
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
const type_1 = require("./type");
function getPropertyDeclaration(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {}, type = node.type ? (0, utils_1.getText)(node.type, sourceFile) : undefined, optional = !!node.questionToken, exclamation = !!node.exclamationToken, initializedValue = node.initializer ? (0, utils_1.getText)(node.initializer, sourceFile) : undefined;
    return Object.assign({ kind: 'property', name,
        type,
        optional,
        exclamation,
        initializedValue, signature: getSignature(name, modifiers, optional, exclamation, type, initializedValue), raw: node.getText(sourceFile) }, modifiers);
}
exports.getPropertyDeclaration = getPropertyDeclaration;
function getPropertySignature(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {}, type = node.type ? (0, type_1.getType)(node.type, sourceFile) : undefined, optional = !!node.questionToken;
    return Object.assign({ kind: 'propertySignature', name,
        type,
        optional, signature: getSignature(name, modifiers, optional, false, type), raw: node.getText(sourceFile) }, modifiers);
}
exports.getPropertySignature = getPropertySignature;
function getSignature(name, modifiers, optional, exclamation, type, initializedValue) {
    const decorators = (0, modifiers_1.getDecoratorsAsString)(modifiers), keywords = (0, modifiers_1.getKeywordsAsString)(modifiers);
    return `${decorators}${keywords}${name}${optional ? '?' : ''}${exclamation ? '!' : ''}${type ? ': ' + type : ''}${initializedValue ? ' = ' + initializedValue : ''}`;
}
//# sourceMappingURL=property.js.map