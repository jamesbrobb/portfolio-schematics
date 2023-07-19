"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicProperties = exports.getOutputs = exports.getInputs = void 0;
const modifiers_1 = require("../definitions/modifiers");
function getInputs(properties) {
    return properties
        .filter(prop => (0, modifiers_1.isDecoratedWith)('Input', prop.modifiers))
        .map(prop => prop.raw);
}
exports.getInputs = getInputs;
function getOutputs(properties) {
    return properties
        .filter(prop => (0, modifiers_1.isDecoratedWith)('Output', prop.modifiers))
        .map(prop => prop.raw);
}
exports.getOutputs = getOutputs;
function getPublicProperties(properties) {
    return properties
        .filter(prop => (0, modifiers_1.isPublic)(prop.name, prop.modifiers))
        .filter(prop => !(0, modifiers_1.isDecoratedWith)('Input', prop.modifiers) && !(0, modifiers_1.isDecoratedWith)('Output', prop.modifiers))
        .map(prop => prop.signature);
}
exports.getPublicProperties = getPublicProperties;
//# sourceMappingURL=ng-helpers.js.map