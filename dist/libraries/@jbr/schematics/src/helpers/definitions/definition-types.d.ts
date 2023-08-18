import * as ts from "typescript";
export type getDefinitionFn<T extends ts.Node = ts.Node, R = unknown> = (node: T, sourceFile: ts.SourceFile) => R;
export type DefinitionParseFunctionMap = {
    [key in `${ts.SyntaxKind}`]?: getDefinitionFn;
};
export type DefinitionTypesMap = {
    [key in `${ts.SyntaxKind}`]?: `${DefinitionTypes}`;
};
export declare enum DefinitionTypes {
    IMPORT = "import",
    IMPORT_CLAUSE = "importClause",
    NAMED_IMPORTS = "namedImports",
    IMPORT_SPECIFIER = "importSpecifier",
    NAMESPACED_IMPORT = "namespacedImport",
    INTERFACE = "interface",
    CLASS = "klass",
    DECORATOR = "decorator",
    NAME = "name",
    TYPE_PARAMETER = "typeParameter",
    TYPE_REFERENCE = "typeReference",
    EXPRESSION_WITH_TYPE_ARGUMENTS = "expressionWithTypeArguments",
    TYPE_ALIAS = "typeAlias",
    TYPE_LITERAL = "typeLiteral",
    HERITAGE = "heritage",
    CONSTRUCTOR = "cnstructor",
    PROPERTY = "property",
    PROPERTY_SIGNATURE = "propertySignature",
    METHOD = "method",
    GETTER = "getter",
    SETTER = "setter",
    STRING_LITERAL = "stringLiteral",
    TUPLE_TYPE = "tupleType",
    ENUM = "enum",
    ENUM_MEMBER = "enumMember",
    VARIABLE = "variable"
}
export declare const definitionTypesMap: DefinitionTypesMap;
export declare const definitionTypeFunctionMap: DefinitionParseFunctionMap;
export declare function parseDefinition(node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean): unknown;
