import * as ts from "typescript";
import {getText} from "../utilities";
import {getModifiers, Modifiers} from "./modifiers";


export type Parameter = {
  name: string,
  optional: boolean,
  signature: string
  type?: string,
  modifiers?: Modifiers
}

export function getParameter(node: ts.ParameterDeclaration, sourceFile: ts.SourceFile): Parameter {

  const name = getText(node.name, sourceFile),
    type = node.type ? getText(node.type, sourceFile) : undefined,
    optional = !!node.questionToken,
    modifiers = getModifiers(node, sourceFile),
    signature = getParameterSignature(name, type, optional);

  return {
    name,
    type,
    optional,
    modifiers,
    signature
  }
}

export function getParametersAsString(parameters: Parameter[], seperator = ', '): string {
  return parameters.map(param => param.signature).join(seperator);
}

function getParameterSignature(name: string, type?: string, optional: boolean = false): string {
    return `${name}${optional ? '?' : ''}${type ? ': ' + type : ''}`;
}
