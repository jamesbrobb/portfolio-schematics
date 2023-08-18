"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getType = exports.getTypeElement = exports.getTypeLiteral = exports.getTypeAliasDeclaration = exports.getExpressionWithTypeArguments = exports.getTypeReference = exports.getTypeParameterDeclaration = void 0;
const ts = require("typescript");
const modifiers_1 = require("./modifiers");
const utils_1 = require("../utils");
const property_1 = require("./property");
function getTypeParameterDeclaration(node, sourceFile) {
    const modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {};
    return Object.assign({ kind: 'typeParameter', name: (0, utils_1.getText)(node.name, sourceFile), constraint: node.constraint ? (0, utils_1.getText)(node.constraint, sourceFile) : undefined, default: node.default ? (0, utils_1.getText)(node.default, sourceFile) : undefined, raw: node.getText(sourceFile) }, modifiers);
}
exports.getTypeParameterDeclaration = getTypeParameterDeclaration;
function getTypeReference(node, sourceFile) {
    return {
        kind: 'typeReference',
        name: (0, utils_1.getText)(node.typeName, sourceFile),
        raw: node.getText(sourceFile)
    };
}
exports.getTypeReference = getTypeReference;
function getExpressionWithTypeArguments(node, sourceFile) {
    return {
        kind: 'expressionWithTypeArguments',
        expression: (0, utils_1.getText)(node.expression, sourceFile),
        typeArguments: node.typeArguments ? node.typeArguments.map(typeArg => (0, utils_1.getText)(typeArg, sourceFile)) : undefined,
        raw: node.getText(sourceFile)
    };
}
exports.getExpressionWithTypeArguments = getExpressionWithTypeArguments;
function getTypeAliasDeclaration(node, sourceFile) {
    const modifiers = (0, modifiers_1.getModifiers)(node, sourceFile) || {};
    return Object.assign({ kind: 'typeAliasDeclaration', name: (0, utils_1.getText)(node.name, sourceFile), typeParameters: node.typeParameters ? node.typeParameters.map(typeParam => getTypeParameterDeclaration(typeParam, sourceFile)) : undefined, type: getType(node.type, sourceFile), raw: node.getText(sourceFile) }, modifiers);
}
exports.getTypeAliasDeclaration = getTypeAliasDeclaration;
function getTypeLiteral(node, sourceFile) {
    return {
        kind: 'typeLiteral',
        members: node.members.map(member => {
            if (ts.isPropertySignature(member)) {
                return (0, property_1.getPropertySignature)(member, sourceFile);
            }
            return {
                kind: member.kind,
                nodeType: ts.SyntaxKind[member.kind],
                raw: (0, utils_1.getText)(member, sourceFile)
            };
        }),
        raw: node.getText(sourceFile)
    };
}
exports.getTypeLiteral = getTypeLiteral;
function getTypeElement(node, sourceFile) {
    return {
        name: node.name ? (0, utils_1.getText)(node.name, sourceFile) : '',
        optional: !!node.questionToken
    };
}
exports.getTypeElement = getTypeElement;
function getType(node, sourceFile) {
    if (ts.isTypeReferenceNode(node)) {
        return getTypeReference(node, sourceFile);
    }
    if (ts.isTypeElement(node)) {
        return getTypeElement(node, sourceFile);
    }
    if (ts.isTypeLiteralNode(node)) {
        return getTypeLiteral(node, sourceFile);
    }
    if (ts.isUnionTypeNode(node)) {
        return node.types.map(type => getType(type, sourceFile));
    }
    return (0, utils_1.getText)(node, sourceFile);
}
exports.getType = getType;
//# sourceMappingURL=type.js.map