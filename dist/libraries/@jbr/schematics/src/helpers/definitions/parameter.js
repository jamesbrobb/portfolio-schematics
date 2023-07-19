"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParametersAsString = exports.getParameter = void 0;
const utilities_1 = require("../utilities");
const modifiers_1 = require("./modifiers");
function getParameter(node, sourceFile) {
    const name = (0, utilities_1.getText)(node.name, sourceFile), type = node.type ? (0, utilities_1.getText)(node.type, sourceFile) : undefined, optional = !!node.questionToken, modifiers = (0, modifiers_1.getModifiers)(node, sourceFile), signature = getParameterSignature(name, type, optional);
    return {
        name,
        type,
        optional,
        modifiers,
        signature
    };
}
exports.getParameter = getParameter;
function getParametersAsString(parameters, seperator = ', ') {
    return parameters.map(param => param.signature).join(seperator);
}
exports.getParametersAsString = getParametersAsString;
function getParameterSignature(name, type, optional = false) {
    return `${name}${optional ? '?' : ''}${type ? ': ' + type : ''}`;
}
//# sourceMappingURL=parameter.js.map