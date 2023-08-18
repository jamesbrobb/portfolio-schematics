import { Modifiers } from "./modifiers";
import * as ts from "typescript";
export type EnumDeclaration = {
    kind: 'enumDeclaration';
    name: string;
    members: EnumMemberDeclaration[];
    raw: string;
} & Modifiers;
export type EnumMemberDeclaration = {
    kind: 'enumMemberDeclaration';
    name: string;
    initializer?: string;
    raw: string;
};
export declare function getEnumDeclaration(node: ts.EnumDeclaration, sourceFile: ts.SourceFile): EnumDeclaration;
export declare function getEnumMemberDeclaration(node: ts.EnumMember, sourceFile: ts.SourceFile): EnumMemberDeclaration;
