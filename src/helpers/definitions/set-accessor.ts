import * as ts from "typescript";
import {getModifiers, Modifiers} from "./modifiers";
import {getParameter, Parameter} from "./parameter";
import {getText} from "../utils";


export type SetAccessor = {
  kind: 'setter',
  name: string,
  type?: string,
  parameters: Parameter[]
} & Modifiers;


export function getSetAccessorDeclaration(node: ts.SetAccessorDeclaration, sourceFile: ts.SourceFile): SetAccessor {

  const modifiers = getModifiers(node, sourceFile) || {};

  return {
    kind: 'setter',
    name: getText(node.name, sourceFile),
    type: node.type ? getText(node.type, sourceFile) : undefined,
    parameters: node.parameters.map(param => getParameter(param, sourceFile)),
    ...modifiers
  };
}
