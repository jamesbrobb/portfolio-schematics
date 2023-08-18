import * as ts from "typescript";
import {getModifiers, Modifiers} from "./modifiers";
import {getText} from "../utils";
import {getPropertySignature, PropertySignature} from "./property";


export type TypeParameter = {
  kind: 'typeParameter',
  name: string,
  constraint?: string,
  default?: string,
  raw: string
} & Modifiers;

export type TypeReference = {
  kind: 'typeReference',
  name: string,
  raw: string
}

export type ExpressionWithTypeArguments = {
  kind: 'expressionWithTypeArguments',
  expression: string,
  typeArguments?: string[],
  raw: string
}

export type TypeAliasDeclaration = {
  kind: 'typeAliasDeclaration',
  name: string,
  typeParameters?: TypeParameter[],
  type: string,
  raw: string
} & Modifiers;

export type TypeLiteral = {
  kind: 'typeLiteral',
  members: ({kind: number, nodeType: string, raw: string} | PropertySignature) [],
  raw: string
}

export type TypeElement = {
  name: string,
  optional?: boolean
}


export function getTypeParameterDeclaration(node: ts.TypeParameterDeclaration, sourceFile: ts.SourceFile): TypeParameter {

  const modifiers = getModifiers(node, sourceFile) || {};

  return {
    kind: 'typeParameter',
    name: getText(node.name, sourceFile),
    constraint: node.constraint ? getText(node.constraint, sourceFile) : undefined,
    default: node.default ? getText(node.default, sourceFile) : undefined,
    raw: node.getText(sourceFile),
    ...modifiers
  }
}


export function getTypeReference(node: ts.TypeReferenceNode, sourceFile: ts.SourceFile): TypeReference {

  return {
    kind: 'typeReference',
    name: getText(node.typeName, sourceFile),
    raw: node.getText(sourceFile)
  }
}


export function getExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments, sourceFile: ts.SourceFile): ExpressionWithTypeArguments {

    return {
      kind: 'expressionWithTypeArguments',
      expression: getText(node.expression, sourceFile),
      typeArguments: node.typeArguments ? node.typeArguments.map(typeArg => getText(typeArg, sourceFile)) : undefined,
      raw: node.getText(sourceFile)
    }
}


export function getTypeAliasDeclaration(node: ts.TypeAliasDeclaration, sourceFile: ts.SourceFile): TypeAliasDeclaration {

  const modifiers = getModifiers(node, sourceFile) || {};

  return {
    kind: 'typeAliasDeclaration',
    name: getText(node.name, sourceFile),
    typeParameters: node.typeParameters ? node.typeParameters.map(typeParam => getTypeParameterDeclaration(typeParam, sourceFile)) : undefined,
    type: getType(node.type, sourceFile),
    raw: node.getText(sourceFile),
    ...modifiers
  }
}

export function getTypeLiteral(node: ts.TypeLiteralNode, sourceFile: ts.SourceFile): TypeLiteral {

  return {
    kind: 'typeLiteral',
    members: node.members.map(member => {

      if(ts.isPropertySignature(member)) {
        return getPropertySignature(member, sourceFile);
      }

      return {
        kind: member.kind,
        nodeType: ts.SyntaxKind[member.kind],
        raw: getText(member, sourceFile)
      }
    }),
    raw: node.getText(sourceFile)
  }
}

export function getTypeElement(node: ts.TypeElement, sourceFile: ts.SourceFile): TypeElement {

    return {
      name: node.name ? getText(node.name, sourceFile) : '',
      optional: !!node.questionToken
    }
}


export function getType(node: ts.Node, sourceFile: ts.SourceFile): string | any {

  if(ts.isTypeReferenceNode(node)) {
    return getTypeReference(node, sourceFile);
  }

  if(ts.isTypeElement(node)) {
    return getTypeElement(node, sourceFile);
  }

  if(ts.isTypeLiteralNode(node)) {
    return getTypeLiteral(node, sourceFile);
  }

  if(ts.isUnionTypeNode(node)) {
    return node.types.map(type => getType(type, sourceFile));
  }

  return getText(node, sourceFile);
}
