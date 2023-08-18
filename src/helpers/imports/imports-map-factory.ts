import * as ts from "typescript";
import * as path from "path";
import {PathResolutionMap, resolvePath} from "../utils";
import {Import, isImportDeclaration} from "../definitions/import";
import {ImportsMap, ImportsMapElement, ImportsMapElementExtended, ImportsMapOptions} from "./imports-map";
import {walkTree} from "../utilities";


export type ImportsMapElementCreatorFn<R extends unknown[]> = (...args: ImportsMapElement) => ImportsMapElementExtended<R>;

export type ImportsMapFactoryOptions<R extends unknown[]> = {
  importsMapElementCreatorFn?: ImportsMapElementCreatorFn<R>
} & ImportsMapOptions


export function createImportsMap<R extends unknown[] = []>(sourceFile: ts.SourceFile, options?: ImportsMapFactoryOptions<R>): ImportsMap<R> {

  // @ts-ignore
  const map: ImportsMap<R> = sourceFile.statements
    .filter(ts.isImportDeclaration)
    .map(impt => walkTree(impt, sourceFile, options))
    .filter(isImportDeclaration)
    .flatMap(imprt => getImportNames(imprt)
      .map(name => [name, resolveModulePath(imprt.module, sourceFile, options?.pathResolutionMap)])
    )
    .map(([name, module]) =>
      options?.importsMapElementCreatorFn?.(name, module) || [name, module] as ImportsMapElement
    );

  if(options?.debug) {
    console.log(map);
  }

  return map;
}


function resolveModulePath(modulePath: string, sourceFile: ts.SourceFile, pathResolutionMap: PathResolutionMap = []): string {

  if(modulePath.startsWith('.')) {
    modulePath = path.resolve(path.dirname(sourceFile.fileName), modulePath);
  }

  return resolvePath(modulePath, pathResolutionMap);
}


function getImportNames(imprt: Import): string[] {

  if(!imprt.children) {
    return [];
  }

  return imprt.children?.map(child => child)
    .flatMap(child => child.children?.map(namedImport => namedImport))
    .flatMap(namedImport => namedImport?.children?.map(importSpecifier => importSpecifier))
    .map(importSpecifier => importSpecifier?.name)
    .filter((name): name is string => !!name);
}
