import * as ts from "typescript";
import {getParameter, Parameter} from "./parameter";


export type Constructor = {
  parameters: Parameter[]
}

export function getConstructor(node: ts.ConstructorDeclaration, sourceFile: ts.SourceFile): Constructor {
  return {
    parameters: node.parameters.map(param => getParameter(param, sourceFile))
  }
}
