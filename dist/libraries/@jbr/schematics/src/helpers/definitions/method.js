"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicMethodSignatures = exports.getMethodDeclaration = void 0;
const parameter_1 = require("./parameter");
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
function getMethodDeclaration(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), type = node.type ? (0, utils_1.getText)(node.type, sourceFile) : undefined, parameters = node.parameters.map(param => (0, parameter_1.getParameter)(param, sourceFile)), modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {};
    return Object.assign({ kind: 'method', name,
        type,
        parameters, signature: getMethodSignature(name, parameters, modifiers, type) }, modifiers);
}
exports.getMethodDeclaration = getMethodDeclaration;
function getPublicMethodSignatures(methods) {
    return methods
        .filter(mthd => (0, modifiers_1.isPublic)(mthd.name, mthd))
        .map(mthd => mthd.signature);
}
exports.getPublicMethodSignatures = getPublicMethodSignatures;
function getMethodSignature(name, parameters, modifiers, type = 'void') {
    const params = (0, parameter_1.getParametersAsString)(parameters), decorators = (0, modifiers_1.getDecoratorsAsString)(modifiers), keywords = (0, modifiers_1.getKeywordsAsString)(modifiers);
    return `${decorators}${keywords}${name}(${params}): ${type === 'void' && keywords.includes('async') ? 'Promise<void>' : type}`;
}
//# sourceMappingURL=method.js.map