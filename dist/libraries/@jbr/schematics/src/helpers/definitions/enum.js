"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumMemberDeclaration = exports.getEnumDeclaration = void 0;
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
function getEnumDeclaration(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {}, members = node.members.map(member => getEnumMemberDeclaration(member, sourceFile));
    return Object.assign({ kind: 'enumDeclaration', name,
        members, raw: node.getText(sourceFile) }, modifiers);
}
exports.getEnumDeclaration = getEnumDeclaration;
function getEnumMemberDeclaration(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), initializer = node.initializer ? (0, utils_1.getText)(node.initializer, sourceFile) : undefined;
    return {
        kind: 'enumMemberDeclaration',
        name,
        initializer,
        raw: node.getText(sourceFile)
    };
}
exports.getEnumMemberDeclaration = getEnumMemberDeclaration;
//# sourceMappingURL=enum.js.map