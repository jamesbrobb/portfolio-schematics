import * as ts from "typescript";
import {getDecoratorsAsString, getKeywordsAsString, getModifiers, Modifiers} from "./modifiers";
import {getText} from "../utils";
import {getType} from "./type";


export type PropertyDeclaration = {
  kind: 'property',
  name: string,
  optional: boolean,
  exclamation: boolean,
  signature: string,
  raw: string
  type?: string,
  initializedValue?: string,
} & Modifiers;


export type PropertySignature = {
  kind: 'propertySignature',
  name: string,
  optional: boolean,
  type?: string,
  signature: string,
  raw: string
} & Modifiers;



export function getPropertyDeclaration(node: ts.PropertyDeclaration, sourceFile: ts.SourceFile): PropertyDeclaration {

  const name = getText(node.name, sourceFile),
    modifiers = getModifiers(node, sourceFile) || {},
    type = node.type ? getText(node.type, sourceFile) : undefined,
    optional = !!node.questionToken,
    exclamation = !!node.exclamationToken,
    initializedValue = node.initializer ? getText(node.initializer, sourceFile) : undefined;

  return {
    kind: 'property',
    name,
    type,
    optional,
    exclamation,
    initializedValue,
    signature: getSignature(name, modifiers, optional, exclamation, type, initializedValue),
    raw: node.getText(sourceFile),
    ...modifiers
  };
}


export function getPropertySignature(node: ts.PropertySignature, sourceFile: ts.SourceFile): PropertySignature {

    const name = getText(node.name, sourceFile),
      modifiers = getModifiers(node, sourceFile) || {},
      type = node.type ? getType(node.type, sourceFile) : undefined,
      optional = !!node.questionToken;

    return {
      kind: 'propertySignature',
      name,
      type,
      optional,
      signature: getSignature(name, modifiers, optional, false, type),
      raw: node.getText(sourceFile),
      ...modifiers
    };
}

function getSignature(name: string, modifiers?: Modifiers, optional?: boolean, exclamation?: boolean, type?: string, initializedValue?: string): string {

  const decorators = getDecoratorsAsString(modifiers),
    keywords = getKeywordsAsString(modifiers);

  return `${decorators}${keywords}${name}${optional ? '?' : ''}${exclamation ? '!' : ''}${type ? ': ' + type : ''}${initializedValue ? ' = ' + initializedValue : ''}`;
}
