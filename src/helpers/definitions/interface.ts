import * as ts from "typescript";
import {getModifiers, Modifiers} from "./modifiers";
import {getText} from "../utils";


export type Interface = {
  kind: 'interface',
  name: string,
  isExported?: boolean,
} & Modifiers;

export function getInterfaceDeclaration(node: ts.InterfaceDeclaration, sourceFile: ts.SourceFile): Interface {

  const modifiers = getModifiers(node, sourceFile) || {};

  return {
    kind: 'interface',
    name: getText(node.name, sourceFile),
    ...modifiers
  }
}
