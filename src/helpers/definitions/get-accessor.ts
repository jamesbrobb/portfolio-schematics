import * as ts from "typescript";
import {getModifiers, Modifiers} from "./modifiers";

import {getText} from "../utils";


export type GetAccessor = {
  kind: 'getter',
  name: string,
  type?: string
} & Modifiers;


export function getGetAccessorDeclaration(node: ts.GetAccessorDeclaration, sourceFile: ts.SourceFile): GetAccessor {

  const modifiers = getModifiers(node, sourceFile) || {};

  return {
    kind: 'getter',
    name: getText(node.name, sourceFile),
    type: node.type ? getText(node.type, sourceFile) : undefined,
    ...modifiers
  };
}
