"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParametersAsString = exports.getParameter = void 0;
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
function getParameter(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), type = node.type ? (0, utils_1.getText)(node.type, sourceFile) : undefined, optional = !!node.questionToken, modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {}, initializedValue = node.initializer ? (0, utils_1.getText)(node.initializer, sourceFile) : undefined;
    return Object.assign({ kind: 'parameter', name,
        type,
        optional,
        initializedValue, signature: getParameterSignature(name, type, optional, initializedValue), raw: node.getText(sourceFile) }, modifiers);
}
exports.getParameter = getParameter;
function getParametersAsString(parameters, seperator = ', ') {
    return parameters.map(param => param.signature).join(seperator);
}
exports.getParametersAsString = getParametersAsString;
function getParameterSignature(name, type, optional, initializedValue) {
    return `${name}${optional ? '?' : ''}${type ? ': ' + type : ''}${initializedValue ? ' = ' + initializedValue : ''}`;
}
//# sourceMappingURL=parameter.js.map