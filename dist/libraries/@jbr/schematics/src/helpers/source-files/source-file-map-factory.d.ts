import * as ts from "typescript";
import { SourceFileMap, SourceFileMapOptions } from "./source-file-map";
export type IgnorePathsMap = (string | RegExp)[];
export type SourceModuleCreatorFn<R extends unknown[]> = (node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean) => [...args: R];
type Options = {
    ignorePathsWith?: IgnorePathsMap;
} & SourceFileMapOptions;
export type SourceFileMapFactoryOptions<R extends unknown[] = []> = R['length'] extends 0 ? Options : Options & {
    sourceModuleCreatorFn: SourceModuleCreatorFn<R>;
};
export declare function createSourceFileMap<R extends unknown[] = []>(program: ts.Program, options?: SourceFileMapFactoryOptions<R>): SourceFileMap<R>;
export {};
