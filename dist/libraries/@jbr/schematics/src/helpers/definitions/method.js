"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicMethodSignatures = exports.getMethodDeclaration = void 0;
const utilities_1 = require("../utilities");
const parameter_1 = require("./parameter");
const modifiers_1 = require("./modifiers");
function getMethodDeclaration(node, sourceFile) {
    const name = (0, utilities_1.getText)(node.name, sourceFile), type = node.type ? (0, utilities_1.getText)(node.type, sourceFile) : undefined, parameters = node.parameters.map(param => (0, parameter_1.getParameter)(param, sourceFile)), modifiers = (0, modifiers_1.getModifiers)(node, sourceFile);
    return {
        name,
        type,
        parameters,
        modifiers,
        signature: getMethodSignature(name, parameters, modifiers, type),
    };
}
exports.getMethodDeclaration = getMethodDeclaration;
function getPublicMethodSignatures(methods) {
    return methods
        .filter(mthd => (0, modifiers_1.isPublic)(mthd.name, mthd.modifiers))
        .map(mthd => mthd.signature);
}
exports.getPublicMethodSignatures = getPublicMethodSignatures;
function getMethodSignature(name, parameters, modifiers, type = 'void') {
    const params = (0, parameter_1.getParametersAsString)(parameters), decorators = (0, modifiers_1.getDecoratorsAsString)(modifiers), keywords = (0, modifiers_1.getKeywordsAsString)(modifiers);
    return `${decorators}${keywords}${name}(${params}): ${type === 'void' && keywords.includes('async') ? 'Promise<void>' : type}`;
}
//# sourceMappingURL=method.js.map