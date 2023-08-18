import * as ts from "typescript";
export type SourceModule = [path: string, kind: ts.SyntaxKind];
export type SourceModuleExtended<E extends unknown[] = []> = [...args: SourceModule, ...rest: ReturnType<SourceModuleOutputFn<E>>];
export type SourceModuleOutputFn<R extends unknown[] = []> = (node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean) => [...args: R];
export type SourceModuleMap<E extends unknown[] = []> = Map<string, SourceModuleExtended<E>>;
export type SourceFileMap<E extends unknown[] = []> = Map<string, SourceModuleMap<E>>;
export type IgnorePathsMap = (string | RegExp)[];
export type PathResolveMap = [matcher: string | RegExp, prepend?: string, append?: string][];
export type DuplicatePrecedenceMap = [path: string | RegExp, priority: number][];
export type SourceFileMapOptions<R extends unknown[] = []> = {
    ignorePathsWith?: IgnorePathsMap;
    pathResolveMap?: PathResolveMap;
    duplicatePrecedenceMap?: DuplicatePrecedenceMap;
    nodeResolveFn?: SourceModuleOutputFn<R>;
    debug?: boolean;
};
export declare const sourceFileMapKeyRegex: RegExp;
export declare function createSourceFileMap<R extends unknown[] = []>(program: ts.Program, options?: SourceFileMapOptions<R>): SourceFileMap<R>;
export declare function resolvePath(path: string, map: PathResolveMap): string;
