import * as ts from "typescript";
import {getText} from "../utils";


export type VariableDeclaration = {
  kind: 'variableDeclaration',
  name: string,
  type?: string,
  exclamationToken?: string,
  initializer?: string,
  raw: string
}

export function getVariableDeclaration(node: ts.VariableDeclaration, sourceFile: ts.SourceFile): VariableDeclaration {

  const name = getText(node.name, sourceFile),
    type = node.type ? getText(node.type, sourceFile) : undefined,
    exclamationToken = node.exclamationToken ? getText(node.exclamationToken, sourceFile) : undefined,
    initializer = node.initializer ? getText(node.initializer, sourceFile) : undefined;

  return {
    kind: 'variableDeclaration',
    name,
    type,
    exclamationToken,
    initializer,
    raw: node.getText(sourceFile)
  };
}
