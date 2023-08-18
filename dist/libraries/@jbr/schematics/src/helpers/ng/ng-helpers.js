"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicProperties = exports.getOutputs = exports.getInputs = void 0;
const modifiers_1 = require("../definitions/modifiers");
function getInputs(properties) {
    return properties
        .filter(prop => (0, modifiers_1.isDecoratedWith)('Input', prop));
}
exports.getInputs = getInputs;
function getOutputs(properties) {
    return properties
        .filter(prop => (0, modifiers_1.isDecoratedWith)('Output', prop))
        .map(prop => prop.signature);
}
exports.getOutputs = getOutputs;
function getPublicProperties(properties) {
    return properties
        .filter(prop => (0, modifiers_1.isPublic)(prop.name, prop))
        .filter(prop => !(0, modifiers_1.isDecoratedWith)('Input', prop) && !(0, modifiers_1.isDecoratedWith)('Output', prop))
        .map(prop => prop.signature);
}
exports.getPublicProperties = getPublicProperties;
//# sourceMappingURL=ng-helpers.js.map