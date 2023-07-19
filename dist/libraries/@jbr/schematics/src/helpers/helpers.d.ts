import * as ts from "typescript";
import { ClassDeclaration } from "./types/class-declaration";
import { Modifiers } from "./types/definition-types";
export declare function getClassDeclarationFromFile(file: string): ClassDeclaration;
export declare function getAllNodesFromSource(sourceFile: ts.SourceFile): ts.Node[];
export declare function getNodesOfKind<T extends ts.Node>(kind: ts.SyntaxKind, sourceFile: ts.SourceFile, nodes?: ts.Node[], findAll?: boolean): T[];
export declare function getText(node: ts.Node, sourceFile: ts.SourceFile): string;
export declare function isPublic(name: string, modifiers: Modifiers | undefined): boolean;
