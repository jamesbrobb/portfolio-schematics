"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseDefinition = exports.definitionTypeFunctionMap = exports.definitionTypesMap = exports.DefinitionTypes = void 0;
const ts = require("typescript");
const decorator_1 = require("./decorator");
const heritage_1 = require("./heritage");
const constructor_1 = require("./constructor");
const property_1 = require("./property");
const method_1 = require("./method");
const get_accessor_1 = require("./get-accessor");
const set_accessor_1 = require("./set-accessor");
const type_1 = require("./type");
const import_1 = require("./import");
const interface_1 = require("./interface");
const primitives_1 = require("./primitives");
const utils_1 = require("../utils");
const class_1 = require("./class");
const enum_1 = require("./enum");
const variable_1 = require("./variable");
var DefinitionTypes;
(function (DefinitionTypes) {
    DefinitionTypes["IMPORT"] = "import";
    DefinitionTypes["IMPORT_CLAUSE"] = "importClause";
    DefinitionTypes["NAMED_IMPORTS"] = "namedImports";
    DefinitionTypes["IMPORT_SPECIFIER"] = "importSpecifier";
    DefinitionTypes["NAMESPACED_IMPORT"] = "namespacedImport";
    DefinitionTypes["INTERFACE"] = "interface";
    DefinitionTypes["CLASS"] = "klass";
    DefinitionTypes["DECORATOR"] = "decorator";
    DefinitionTypes["NAME"] = "name";
    DefinitionTypes["TYPE_PARAMETER"] = "typeParameter";
    DefinitionTypes["TYPE_REFERENCE"] = "typeReference";
    DefinitionTypes["EXPRESSION_WITH_TYPE_ARGUMENTS"] = "expressionWithTypeArguments";
    DefinitionTypes["TYPE_ALIAS"] = "typeAlias";
    DefinitionTypes["TYPE_LITERAL"] = "typeLiteral";
    DefinitionTypes["HERITAGE"] = "heritage";
    DefinitionTypes["CONSTRUCTOR"] = "cnstructor";
    DefinitionTypes["PROPERTY"] = "property";
    DefinitionTypes["PROPERTY_SIGNATURE"] = "propertySignature";
    DefinitionTypes["METHOD"] = "method";
    DefinitionTypes["GETTER"] = "getter";
    DefinitionTypes["SETTER"] = "setter";
    DefinitionTypes["STRING_LITERAL"] = "stringLiteral";
    DefinitionTypes["TUPLE_TYPE"] = "tupleType";
    DefinitionTypes["ENUM"] = "enum";
    DefinitionTypes["ENUM_MEMBER"] = "enumMember";
    DefinitionTypes["VARIABLE"] = "variable";
})(DefinitionTypes || (exports.DefinitionTypes = DefinitionTypes = {}));
exports.definitionTypesMap = {
    [ts.SyntaxKind.ImportDeclaration]: DefinitionTypes.IMPORT,
    [ts.SyntaxKind.ImportClause]: DefinitionTypes.IMPORT_CLAUSE,
    [ts.SyntaxKind.NamedImports]: DefinitionTypes.NAMED_IMPORTS,
    [ts.SyntaxKind.ImportSpecifier]: DefinitionTypes.IMPORT_SPECIFIER,
    [ts.SyntaxKind.NamespaceImport]: DefinitionTypes.NAMESPACED_IMPORT,
    [ts.SyntaxKind.ClassDeclaration]: DefinitionTypes.CLASS,
    [ts.SyntaxKind.InterfaceDeclaration]: DefinitionTypes.INTERFACE,
    [ts.SyntaxKind.Decorator]: DefinitionTypes.DECORATOR,
    [ts.SyntaxKind.Identifier]: DefinitionTypes.NAME,
    [ts.SyntaxKind.TypeParameter]: DefinitionTypes.TYPE_PARAMETER,
    [ts.SyntaxKind.TypeReference]: DefinitionTypes.TYPE_REFERENCE,
    [ts.SyntaxKind.ExpressionWithTypeArguments]: DefinitionTypes.EXPRESSION_WITH_TYPE_ARGUMENTS,
    [ts.SyntaxKind.TypeAliasDeclaration]: DefinitionTypes.TYPE_ALIAS,
    [ts.SyntaxKind.TypeLiteral]: DefinitionTypes.TYPE_LITERAL,
    [ts.SyntaxKind.HeritageClause]: DefinitionTypes.HERITAGE,
    [ts.SyntaxKind.Constructor]: DefinitionTypes.CONSTRUCTOR,
    [ts.SyntaxKind.PropertyDeclaration]: DefinitionTypes.PROPERTY,
    [ts.SyntaxKind.PropertySignature]: DefinitionTypes.PROPERTY_SIGNATURE,
    [ts.SyntaxKind.MethodDeclaration]: DefinitionTypes.METHOD,
    [ts.SyntaxKind.GetAccessor]: DefinitionTypes.GETTER,
    [ts.SyntaxKind.SetAccessor]: DefinitionTypes.SETTER,
    [ts.SyntaxKind.StringLiteral]: DefinitionTypes.STRING_LITERAL,
    [ts.SyntaxKind.TupleType]: DefinitionTypes.TUPLE_TYPE,
    [ts.SyntaxKind.EnumDeclaration]: DefinitionTypes.ENUM,
    [ts.SyntaxKind.EnumMember]: DefinitionTypes.ENUM_MEMBER,
    [ts.SyntaxKind.VariableDeclaration]: DefinitionTypes.VARIABLE
};
exports.definitionTypeFunctionMap = {
    [ts.SyntaxKind.ImportDeclaration]: import_1.getImportDeclaration,
    [ts.SyntaxKind.ImportClause]: import_1.getImportClause,
    [ts.SyntaxKind.NamedImports]: import_1.getNamedImports,
    [ts.SyntaxKind.ImportSpecifier]: (0, utils_1.ignoreChildren)(import_1.getImportSpecifier),
    [ts.SyntaxKind.NamespaceImport]: import_1.getNamespaceImport,
    [ts.SyntaxKind.Decorator]: (0, utils_1.ignoreChildren)(decorator_1.getDecorator),
    [ts.SyntaxKind.InterfaceDeclaration]: interface_1.getInterfaceDeclaration,
    [ts.SyntaxKind.ClassDeclaration]: (node, sourceFile) => (0, class_1.getClassDec)(node, sourceFile),
    [ts.SyntaxKind.HeritageClause]: (0, utils_1.ignoreChildren)(heritage_1.getHeritageClause),
    [ts.SyntaxKind.Constructor]: (0, utils_1.ignoreChildren)(constructor_1.getConstructor),
    [ts.SyntaxKind.PropertyDeclaration]: (0, utils_1.ignoreChildren)(property_1.getPropertyDeclaration),
    [ts.SyntaxKind.PropertySignature]: property_1.getPropertySignature,
    [ts.SyntaxKind.MethodDeclaration]: (0, utils_1.ignoreChildren)(method_1.getMethodDeclaration),
    [ts.SyntaxKind.GetAccessor]: get_accessor_1.getGetAccessorDeclaration,
    [ts.SyntaxKind.SetAccessor]: set_accessor_1.getSetAccessorDeclaration,
    [ts.SyntaxKind.Identifier]: utils_1.getText,
    [ts.SyntaxKind.TypeParameter]: type_1.getTypeParameterDeclaration,
    [ts.SyntaxKind.TypeReference]: (0, utils_1.ignoreChildren)(type_1.getTypeReference),
    [ts.SyntaxKind.ExpressionWithTypeArguments]: type_1.getExpressionWithTypeArguments,
    [ts.SyntaxKind.TypeAliasDeclaration]: (0, utils_1.ignoreChildren)(type_1.getTypeAliasDeclaration),
    [ts.SyntaxKind.TypeLiteral]: type_1.getTypeLiteral,
    [ts.SyntaxKind.StringLiteral]: utils_1.getText,
    [ts.SyntaxKind.TupleType]: primitives_1.getTupleDeclaration,
    [ts.SyntaxKind.EnumDeclaration]: (0, utils_1.ignoreChildren)(enum_1.getEnumDeclaration),
    [ts.SyntaxKind.EnumMember]: enum_1.getEnumMemberDeclaration,
    [ts.SyntaxKind.VariableDeclaration]: (0, utils_1.ignoreChildren)(variable_1.getVariableDeclaration),
};
function parseDefinition(node, sourceFile, debug) {
    const parseFunc = exports.definitionTypeFunctionMap[node.kind];
    if (!parseFunc && debug) {
        console.warn(`No parse function registered for ${ts.SyntaxKind[node.kind]} - kind: ${node.kind}`);
    }
    return (parseFunc === null || parseFunc === void 0 ? void 0 : parseFunc(node, sourceFile)) || {
        raw: node.getText(sourceFile),
        kind: node.kind,
        type: ts.SyntaxKind[node.kind]
    };
}
exports.parseDefinition = parseDefinition;
//# sourceMappingURL=definition-types.js.map