import * as ts from "typescript";
import {log} from "../utils";
import {SourceFileMap, SourceFileMapOptions} from "./source-file-map";
import {convertSourceFileToSymbol} from "../symbol-helper";


export type IgnorePathsMap = (string | RegExp)[];
export type SourceModuleCreatorFn<R extends unknown[]> = (
  node: ts.Node,
  sourceFile: ts.SourceFile,
  debug?: boolean
) => [...args: R];

type Options = {
  ignorePathsWith?: IgnorePathsMap,
} & SourceFileMapOptions


export type SourceFileMapFactoryOptions<R extends unknown[] = []> =
  R['length'] extends 0 ? Options : Options & { sourceModuleCreatorFn: SourceModuleCreatorFn<R> }


type SymbolWithExports = ts.Symbol & {exports: ts.SymbolTable};
type SourceAndSymbolTuple = [sourceFile: ts.SourceFile, symbol: SymbolWithExports];

export function createSourceFileMap<R extends unknown[] = []>(program: ts.Program, options?: SourceFileMapFactoryOptions<R>): SourceFileMap<R> {

  const sourceFilesMap = new SourceFileMap<R>(options);

  program.getSourceFiles()
    .filter(sourceFile => isSourceFileEligible(program, sourceFile, options))
    .map(sourceFile => [sourceFile, getSymbolFromSource(program, sourceFile)])
    .filter((arg): arg is SourceAndSymbolTuple => !!arg[1])
    .forEach(([sourceFile, symbol]) => {

      symbol.exports.forEach((value, key) => {

        if (['__export', '__exportStar'].includes(value.name) || value.name.includes('ɵ')) {
          return;
        }

        const declaration = value.declarations?.[0];

        if (!declaration) {
          return;
        }

        let extras: R | undefined;

        if(options && 'sourceModuleCreatorFn' in options) {
          extras = options.sourceModuleCreatorFn(declaration, sourceFile, options.debug);
        }

        sourceFilesMap.set(symbol.name, key.toString(), declaration.kind, ...(extras || []) as any);
      });
    });

  if(options?.debug) {
    log(sourceFilesMap.toString(), 'SOURCE FILES MAP');
  }

  return sourceFilesMap;
}

function isSourceFileEligible(program: ts.Program, sourceFile: ts.SourceFile, options?: SourceFileMapFactoryOptions): boolean {

  const baseUrl = program.getCompilerOptions().baseUrl || '';

  if(!baseUrl && options?.debug) {
    console.warn('No baseUrl found in tsconfig.json');
  }

  if(!sourceFile.fileName.includes(baseUrl)) {
    return false;
  }

  return !ignorePath(sourceFile.fileName, options?.ignorePathsWith || [], options?.debug)
}

function getSymbolFromSource(program: ts.Program, sourceFile: ts.SourceFile): SymbolWithExports | undefined {

  const symbol = convertSourceFileToSymbol(program, sourceFile);

  if(isSymbolWithExports(symbol)) {
    return symbol;
  }

  return undefined;
}

function isSymbolWithExports(symbol?: ts.Symbol): symbol is SymbolWithExports {
  return !!symbol?.exports?.size;
}


function ignorePath(path: string, map: IgnorePathsMap, debug: boolean = false): boolean {

  const ignore = map.some(value => {
    return path.search(value) !== -1;
  });

  if(ignore && debug) {
    log(path, 'IGNORING PATH')
  }

  return ignore;
}
