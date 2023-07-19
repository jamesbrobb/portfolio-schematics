import * as ts from "typescript";
import { ClassDeclaration } from "./definitions/class";
export declare function getClassDeclarationFromFile(file: string): ClassDeclaration;
export declare function getAllNodesFromSource(sourceFile: ts.SourceFile): ts.Node[];
export declare function getNodesOfKind<T extends ts.Node>(kind: ts.SyntaxKind, sourceFile: ts.SourceFile, nodes?: ts.Node[], findAll?: boolean): T[];
export declare function getText(node: ts.Node, sourceFile: ts.SourceFile): string;
