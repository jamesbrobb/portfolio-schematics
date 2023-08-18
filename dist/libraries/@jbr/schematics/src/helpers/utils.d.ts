import * as ts from "typescript";
import { DefinitionTypes, getDefinitionFn } from "./definitions/definition-types";
import { ParsedResult } from "./utilities";
export declare function ignoreChildren<F extends getDefinitionFn>(func: F): (...args: Parameters<F>) => ParsedResult<ReturnType<F>>;
export declare function getText(node: ts.Node, sourceFile: ts.SourceFile): string;
export declare function getChildByKind<R>(declaration: {
    children: [];
}, kind: DefinitionTypes): R[];
export type PathResolutionMap = [matcher: string | RegExp, prepend?: string, append?: string][];
export declare function resolvePath(path: string, map: PathResolutionMap): string;
export type DuplicatePathPrecedenceMap = [path: string | RegExp, priority: number][];
export declare function resolveDuplicatePath(existingPath: string, newPath: string, map: DuplicatePathPrecedenceMap): number;
export declare function log(message: any, header?: string): void;
