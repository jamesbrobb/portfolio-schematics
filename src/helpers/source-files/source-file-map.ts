import * as ts from "typescript";
import {
  PathResolutionMap,
  resolvePath,
  DuplicatePathPrecedenceMap,
  resolveDuplicatePath,
  log
} from "../utils";


export type SourceFileMapElement = [path: string, kind: ts.SyntaxKind]
export type SourceFileMapElementExtended<R extends unknown[] = []> = [...args: SourceFileMapElement, ...rest: R]
export type SourceModuleMap<E extends unknown[]> = Map<string, SourceFileMapElementExtended<E>>

export type SourceFileMapOptions = {
  moduleKeyRegex?: RegExp,
  pathResolutionMap?: PathResolutionMap,
  duplicatePathPrecedenceMap?: DuplicatePathPrecedenceMap,
  debug?: boolean
}

export const sourceFileMapKeyRegex = /^((@.*?\/)*[^\/]*)/g;


export class SourceFileMap<E extends unknown[]> {

  readonly #keyRegex: RegExp = sourceFileMapKeyRegex;
  readonly #pathResolutionMap: PathResolutionMap = [];
  readonly #duplicatePathPrecedenceMap: DuplicatePathPrecedenceMap = [];
  readonly #debug: boolean = false;

  #map = new Map<string, SourceModuleMap<E>>();

  constructor(options?: SourceFileMapOptions) {
    this.#keyRegex = options?.moduleKeyRegex || this.#keyRegex;
    this.#pathResolutionMap = options?.pathResolutionMap || this.#pathResolutionMap;
    this.#duplicatePathPrecedenceMap = options?.duplicatePathPrecedenceMap || this.#duplicatePathPrecedenceMap;
    this.#debug = options?.debug || this.#debug;
  }

  set(modulePath: string, entityName: string, kind: ts.SyntaxKind, ...extras: E): void {

    modulePath = resolvePath(modulePath, this.#pathResolutionMap);

    const key = modulePath.match(this.#keyRegex)?.[0] || '';

    if(!key && this.#debug) {
      log(`${entityName} skipped for ${modulePath}`, 'NO KEY FOUND');
      return;
    }

    const moduleMap: SourceModuleMap<E> = this.#map.get(key) || new Map(),
      existingElement = moduleMap.get(entityName);

    if(existingElement) {

      const resolution = resolveDuplicatePath(existingElement[0], modulePath, this.#duplicatePathPrecedenceMap);
      modulePath = resolution === 1 ? modulePath : existingElement[0];

      if(resolution === 0 && this.#debug) {
        log(`Name: ${entityName}\nStored path: ${moduleMap.get(entityName)}\nDuplicate path: ${modulePath}`, 'DUPLICATE NAME FOUND');
        return;
      }
    }

    moduleMap.set(entityName, [modulePath, kind, ...extras]);

    this.#map.set(key, moduleMap);
  }

  get(modulePath: string, entityName: string): SourceFileMapElementExtended<E> | undefined {

    const key = modulePath.match(this.#keyRegex)?.[0] || '';

    if(!key) {

      if(this.#debug) {
        log(`${entityName} skipped for ${modulePath}`, 'NO KEY FOUND');
      }

      return;
    }

    const moduleMap = this.#map.get(key);

    if(!moduleMap) {

      if(this.#debug) {
        console.log(`No source module map found for ${key}`);
      }

      return;
    }

    return moduleMap.get(entityName);
  }

  toString(): string {
    console.log(this.#map);
    return '';
  }
}


