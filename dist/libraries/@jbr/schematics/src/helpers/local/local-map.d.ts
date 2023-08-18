import * as ts from "typescript";
export type LocalMapElement = [kind: ts.SyntaxKind, node: ts.Declaration];
export type LocalMap = Map<string, LocalMapElement>;
export declare function createLocalMap(program: ts.Program, sourceFile: ts.SourceFile): LocalMap;
