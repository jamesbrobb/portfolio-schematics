import * as ts from "typescript";
import {getDecorator} from "./decorator";
import {getHeritageClause} from "./heritage";
import {getConstructor} from "./constructor";
import {getPropertyDeclaration, getPropertySignature} from "./property";
import {getMethodDeclaration} from "./method";
import {getGetAccessorDeclaration} from "./get-accessor";
import {getSetAccessorDeclaration} from "./set-accessor";
import {
  getExpressionWithTypeArguments,
  getTypeAliasDeclaration,
  getTypeLiteral,
  getTypeParameterDeclaration,
  getTypeReference
} from "./type";
import {getImportClause, getImportDeclaration, getImportSpecifier, getNamedImports, getNamespaceImport} from "./import";
import {getInterfaceDeclaration} from "./interface";
import {getTupleDeclaration} from "./primitives";
import {getText, ignoreChildren} from "../utils";
import {getClassDec} from "./class";
import {getEnumDeclaration, getEnumMemberDeclaration} from "./enum";
import {getVariableDeclaration} from "./variable";



export type getDefinitionFn<T extends ts.Node = ts.Node, R = unknown> = (node: T, sourceFile: ts.SourceFile) => R;

export type DefinitionParseFunctionMap = {[key in `${ts.SyntaxKind}`]?: getDefinitionFn}

export type DefinitionTypesMap = {[key in `${ts.SyntaxKind}`]?: `${DefinitionTypes}`};

export enum DefinitionTypes {
  IMPORT = 'import',
  IMPORT_CLAUSE = 'importClause',
  NAMED_IMPORTS = 'namedImports',
  IMPORT_SPECIFIER = 'importSpecifier',
  NAMESPACED_IMPORT = 'namespacedImport',
  INTERFACE = 'interface',
  CLASS = 'klass',
  DECORATOR = 'decorator',
  NAME = 'name',
  TYPE_PARAMETER = 'typeParameter',
  TYPE_REFERENCE = 'typeReference',
  EXPRESSION_WITH_TYPE_ARGUMENTS = 'expressionWithTypeArguments',
  TYPE_ALIAS = 'typeAlias',
  TYPE_LITERAL = 'typeLiteral',
  HERITAGE = 'heritage',
  CONSTRUCTOR = 'cnstructor',
  PROPERTY = 'property',
  PROPERTY_SIGNATURE = 'propertySignature',
  METHOD = 'method',
  GETTER = 'getter',
  SETTER = 'setter',
  STRING_LITERAL = 'stringLiteral',
  TUPLE_TYPE = 'tupleType',
  ENUM = 'enum',
  ENUM_MEMBER = 'enumMember',
  VARIABLE = 'variable'
}

export const definitionTypesMap: DefinitionTypesMap = {
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
}

export const definitionTypeFunctionMap: DefinitionParseFunctionMap = {
  [ts.SyntaxKind.ImportDeclaration]: getImportDeclaration,
  [ts.SyntaxKind.ImportClause]: getImportClause,
  [ts.SyntaxKind.NamedImports]: getNamedImports,
  [ts.SyntaxKind.ImportSpecifier]: ignoreChildren(getImportSpecifier),
  [ts.SyntaxKind.NamespaceImport]: getNamespaceImport,
  [ts.SyntaxKind.Decorator]: ignoreChildren(getDecorator),
  [ts.SyntaxKind.InterfaceDeclaration]: getInterfaceDeclaration,
  [ts.SyntaxKind.ClassDeclaration]: (node, sourceFile) => getClassDec(node as any, sourceFile),
  [ts.SyntaxKind.HeritageClause]: ignoreChildren(getHeritageClause),
  [ts.SyntaxKind.Constructor]: ignoreChildren(getConstructor),
  [ts.SyntaxKind.PropertyDeclaration]: ignoreChildren(getPropertyDeclaration),
  [ts.SyntaxKind.PropertySignature]: getPropertySignature,
  [ts.SyntaxKind.MethodDeclaration]: ignoreChildren(getMethodDeclaration),
  [ts.SyntaxKind.GetAccessor]: getGetAccessorDeclaration,
  [ts.SyntaxKind.SetAccessor]: getSetAccessorDeclaration,
  [ts.SyntaxKind.Identifier]: getText,
  [ts.SyntaxKind.TypeParameter]: getTypeParameterDeclaration,
  [ts.SyntaxKind.TypeReference]: ignoreChildren(getTypeReference),
  [ts.SyntaxKind.ExpressionWithTypeArguments]: getExpressionWithTypeArguments,
  [ts.SyntaxKind.TypeAliasDeclaration]: ignoreChildren(getTypeAliasDeclaration),
  [ts.SyntaxKind.TypeLiteral]: getTypeLiteral,
  [ts.SyntaxKind.StringLiteral]: getText,
  [ts.SyntaxKind.TupleType]: getTupleDeclaration,
  [ts.SyntaxKind.EnumDeclaration]: ignoreChildren(getEnumDeclaration),
  [ts.SyntaxKind.EnumMember]: getEnumMemberDeclaration,
  [ts.SyntaxKind.VariableDeclaration]: ignoreChildren(getVariableDeclaration),
}


export function parseDefinition(node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean): unknown {

  const parseFunc = definitionTypeFunctionMap[node.kind];

  if(!parseFunc && debug) {
    console.warn(`No parse function registered for ${ts.SyntaxKind[node.kind]} - kind: ${node.kind}`);
  }

  return parseFunc?.(node, sourceFile) || {
    raw: node.getText(sourceFile),
    kind: node.kind,
    type: ts.SyntaxKind[node.kind]
  }
}






















