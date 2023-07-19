import * as ts from "typescript";
import {getModifiers, Modifiers} from "./modifiers";
import {getText} from "../utilities";


export type GetAccessor = {
  name: string,
  type?: string,
  modifiers?: Modifiers
}


export function getGetAccessorDeclaration(node: ts.GetAccessorDeclaration, sourceFile: ts.SourceFile): GetAccessor {

  return {
    name: getText(node.name, sourceFile),
    type: node.type ? getText(node.type, sourceFile) : undefined,
    modifiers: getModifiers(node, sourceFile)
  };
}
