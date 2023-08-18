import * as ts from "typescript";
import { ImportsMap, ImportsMapElement, ImportsMapElementExtended, ImportsMapOptions } from "./imports-map";
export type ImportsMapElementCreatorFn<R extends unknown[]> = (...args: ImportsMapElement) => ImportsMapElementExtended<R>;
export type ImportsMapFactoryOptions<R extends unknown[]> = {
    importsMapElementCreatorFn?: ImportsMapElementCreatorFn<R>;
} & ImportsMapOptions;
export declare function createImportsMap<R extends unknown[] = []>(sourceFile: ts.SourceFile, options?: ImportsMapFactoryOptions<R>): ImportsMap<R>;
