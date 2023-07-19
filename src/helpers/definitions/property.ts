import * as ts from "typescript";
import {getText} from "../utilities";
import {getDecoratorsAsString, getKeywordsAsString, getModifiers, Modifiers} from "./modifiers";


export type Property = {
  name: string,
  optional: boolean,
  exclamation: boolean,
  signature: string,
  raw: string
  type?: string,
  modifiers?: Modifiers,
  initializedValue?: string,
}


export function getPropertyDeclaration(node: ts.PropertyDeclaration, sourceFile: ts.SourceFile): Property {

  const name = getText(node.name, sourceFile),
    modifiers = getModifiers(node, sourceFile);

  return {
    name,
    modifiers,
    signature: getPropertySignature(name, modifiers),
    type: node.type ? getText(node.type, sourceFile) : undefined,
    optional: !!node.questionToken,
    exclamation: !!node.exclamationToken,
    initializedValue: node.initializer ? getText(node.initializer, sourceFile) : undefined,
    raw: node.getText(sourceFile)
  };
}

function getPropertySignature(name: string, modifiers?: Modifiers): string {

  const decorators = getDecoratorsAsString(modifiers),
    keywords = getKeywordsAsString(modifiers);

  return `${decorators}${keywords}${name}`;
}
