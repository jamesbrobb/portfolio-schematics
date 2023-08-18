"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNamespaceImport = exports.getImportSpecifier = exports.getImportClause = exports.getNamedImports = exports.getImportDeclaration = exports.isImportDeclaration = void 0;
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
function isImportDeclaration(result) {
    return 'kind' in result && result.kind === 'import';
}
exports.isImportDeclaration = isImportDeclaration;
function getImportDeclaration(node, sourceFile) {
    const module = (0, utils_1.getText)(node.moduleSpecifier, sourceFile), modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {};
    return Object.assign({ kind: 'import', module, raw: node.getText(sourceFile) }, modifiers);
}
exports.getImportDeclaration = getImportDeclaration;
function getNamedImports(node, sourceFile) {
    return {
        kind: 'namedImports',
        raw: node.getText(sourceFile)
    };
}
exports.getNamedImports = getNamedImports;
function getImportClause(node, sourceFile) {
    const name = node.name ? (0, utils_1.getText)(node.name, sourceFile) : undefined;
    return {
        kind: 'importClause',
        name,
        isTypeOnly: node.isTypeOnly,
        raw: node.getText(sourceFile)
    };
}
exports.getImportClause = getImportClause;
function getImportSpecifier(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile), propertyName = node.propertyName ? (0, utils_1.getText)(node.propertyName, sourceFile) : undefined;
    return {
        kind: 'importSpecifier',
        name,
        propertyName,
        raw: node.getText(sourceFile)
    };
}
exports.getImportSpecifier = getImportSpecifier;
function getNamespaceImport(node, sourceFile) {
    const name = (0, utils_1.getText)(node.name, sourceFile);
    return {
        kind: 'namespaceImport',
        name,
        raw: node.getText(sourceFile)
    };
}
exports.getNamespaceImport = getNamespaceImport;
//# sourceMappingURL=import.js.map