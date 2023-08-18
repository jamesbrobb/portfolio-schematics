import * as ts from "typescript";
import { PathResolutionMap, DuplicatePathPrecedenceMap } from "../utils";
export type SourceFileMapElement = [path: string, kind: ts.SyntaxKind];
export type SourceFileMapElementExtended<R extends unknown[] = []> = [...args: SourceFileMapElement, ...rest: R];
export type SourceModuleMap<E extends unknown[]> = Map<string, SourceFileMapElementExtended<E>>;
export type SourceFileMapOptions = {
    moduleKeyRegex?: RegExp;
    pathResolutionMap?: PathResolutionMap;
    duplicatePathPrecedenceMap?: DuplicatePathPrecedenceMap;
    debug?: boolean;
};
export declare const sourceFileMapKeyRegex: RegExp;
export declare class SourceFileMap<E extends unknown[]> {
    #private;
    constructor(options?: SourceFileMapOptions);
    set(modulePath: string, entityName: string, kind: ts.SyntaxKind, ...extras: E): void;
    get(modulePath: string, entityName: string): SourceFileMapElementExtended<E> | undefined;
    toString(): string;
}
