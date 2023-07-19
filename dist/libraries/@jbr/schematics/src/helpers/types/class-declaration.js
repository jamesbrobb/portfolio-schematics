"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassDeclaration = exports.DefinitionType = void 0;
const ts = require("typescript");
const decorators_1 = require("./decorators");
const helpers_1 = require("../helpers");
const definition_types_1 = require("./definition-types");
var DefinitionType;
(function (DefinitionType) {
    DefinitionType[DefinitionType["Decorator"] = 169] = "Decorator";
    DefinitionType[DefinitionType["Identifier"] = 80] = "Identifier";
    DefinitionType[DefinitionType["HeritageClause"] = 297] = "HeritageClause";
    DefinitionType[DefinitionType["Constructor"] = 175] = "Constructor";
    DefinitionType[DefinitionType["PropertyDeclaration"] = 171] = "PropertyDeclaration";
    DefinitionType[DefinitionType["MethodDeclaration"] = 173] = "MethodDeclaration";
    DefinitionType[DefinitionType["GetAccessor"] = 176] = "GetAccessor";
    DefinitionType[DefinitionType["SetAccessor"] = 177] = "SetAccessor";
})(DefinitionType || (exports.DefinitionType = DefinitionType = {}));
const definitionTypeFunctionMap = {
    [DefinitionType.Decorator]: decorators_1.getDecorator,
    [DefinitionType.HeritageClause]: definition_types_1.getHeritageClause,
    [DefinitionType.Constructor]: definition_types_1.getConstructor,
    [DefinitionType.PropertyDeclaration]: definition_types_1.getPropertyDeclaration,
    [DefinitionType.MethodDeclaration]: definition_types_1.getMethodDeclaration,
    [DefinitionType.GetAccessor]: definition_types_1.getGetAccessorDeclaration,
    [DefinitionType.SetAccessor]: definition_types_1.getSetAccessorDeclaration,
    [DefinitionType.Identifier]: (node, sourceFile) => (0, helpers_1.getText)(node, sourceFile),
};
function getClassDeclaration(sourceFile) {
    const declaration = {
        [ts.SyntaxKind.Decorator]: undefined,
        [ts.SyntaxKind.Identifier]: undefined,
        [ts.SyntaxKind.HeritageClause]: [],
        [ts.SyntaxKind.Constructor]: undefined,
        [ts.SyntaxKind.PropertyDeclaration]: [],
        [ts.SyntaxKind.MethodDeclaration]: [],
        [ts.SyntaxKind.GetAccessor]: [],
        [ts.SyntaxKind.SetAccessor]: []
    }, classDec = (0, helpers_1.getNodesOfKind)(ts.SyntaxKind.ClassDeclaration, sourceFile)[0];
    if (!classDec) {
        throw new Error("No Class Declaration found");
    }
    classDec.getChildren(sourceFile)
        .map(node => node.kind === ts.SyntaxKind.SyntaxList ? node.getChildren(sourceFile) : node)
        .flat(1)
        .forEach(node => {
        const parseFunc = definitionTypeFunctionMap[node.kind];
        if (!parseFunc) {
            console.log(`No parse function registered for ${ts.SyntaxKind[node.kind]}`);
            return;
        }
        if (Array.isArray(declaration[node.kind])) {
            declaration[node.kind].push(parseFunc(node, sourceFile));
            return;
        }
        declaration[node.kind] = parseFunc(node, sourceFile);
    });
    return declaration;
}
exports.getClassDeclaration = getClassDeclaration;
//# sourceMappingURL=class-declaration.js.map