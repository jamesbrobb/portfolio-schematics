import * as ts from "typescript";
import {getParameter, Parameter} from "./parameter";


export type Constructor = {
  kind: 'constructor'
  parameters: Parameter[]
}

export function getConstructor(node: ts.ConstructorDeclaration, sourceFile: ts.SourceFile): Constructor {
  return {
    kind: 'constructor',
    parameters: node.parameters.map(param => getParameter(param, sourceFile))
  }
}
