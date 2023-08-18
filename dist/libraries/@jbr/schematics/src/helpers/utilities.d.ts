import * as ts from "typescript";
import { ClassDeclaration } from "./definitions/class";
export declare function getClassDeclarationFromFile(file: string): ClassDeclaration;
export type ParsedResult<R> = {
    result: R;
    exit: boolean;
};
export declare function isParsedResult<R>(result: any): result is ParsedResult<R>;
export type GetNodeKeyFunc = (node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean) => PropertyKey;
export type ParseNodeFunc<R> = (node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean) => R | ParsedResult<R>;
export type Options<R> = {
    keyMapFn?: GetNodeKeyFunc;
    nodeParseFn?: ParseNodeFunc<R>;
    returnArray?: boolean;
    lazy?: boolean;
    debug?: boolean;
};
export declare function walkTree<R = ts.Node>(node: ts.Node, sourceFile: ts.SourceFile, options?: Options<R>): any[] | Record<PropertyKey, unknown>;
export declare function parseSourceFile<R = ts.Node>(program: ts.Program, sourceFile: ts.SourceFile, options?: Options<R>): any[] | {};
export declare function getExportedDeclarationsFromSource(program: ts.Program, sourceFile: ts.SourceFile): ts.Declaration[];
export declare function getAllNodesFromSource(sourceFile: ts.SourceFile): ts.Node[];
export declare function getNodesOfKind<T extends ts.Node>(kind: ts.SyntaxKind, sourceFile: ts.SourceFile, nodes?: ts.Node[], findAll?: boolean): T[];
