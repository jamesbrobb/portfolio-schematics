import {getModifiers, Modifiers} from "./modifiers";
import {getText} from "../utils";
import * as ts from "typescript";


export type EnumDeclaration = {
  kind: 'enumDeclaration',
  name: string,
  members: EnumMemberDeclaration[],
  raw: string
} & Modifiers;


export type EnumMemberDeclaration = {
  kind: 'enumMemberDeclaration',
  name: string,
  initializer?: string,
  raw: string
}


export function getEnumDeclaration(node: ts.EnumDeclaration, sourceFile: ts.SourceFile): EnumDeclaration {

  const name = getText(node.name, sourceFile),
    modifiers = getModifiers(node, sourceFile) || {},
    members = node.members.map(member => getEnumMemberDeclaration(member, sourceFile));

  return {
    kind: 'enumDeclaration',
    name,
    members,
    raw: node.getText(sourceFile),
    ...modifiers
  };
}


export function getEnumMemberDeclaration(node: ts.EnumMember, sourceFile: ts.SourceFile): EnumMemberDeclaration {

    const name = getText(node.name, sourceFile),
      initializer = node.initializer ? getText(node.initializer, sourceFile) : undefined;

    return {
      kind: 'enumMemberDeclaration',
      name,
      initializer,
      raw: node.getText(sourceFile)
    };
}
