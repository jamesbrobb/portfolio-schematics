import * as ts from "typescript";
import {getText} from "../utilities";
import {getModifiers, Modifiers} from "./modifiers";
import {getParameter, Parameter} from "./parameter";


export type SetAccessor = {
  name: string,
  type?: string,
  parameters: Parameter[],
  modifiers?: Modifiers
}


export function getSetAccessorDeclaration(node: ts.SetAccessorDeclaration, sourceFile: ts.SourceFile): SetAccessor {

  return {
    name: getText(node.name, sourceFile),
    type: node.type ? getText(node.type, sourceFile) : undefined,
    parameters: node.parameters.map(param => getParameter(param, sourceFile)),
    modifiers: getModifiers(node, sourceFile)
  };
}
