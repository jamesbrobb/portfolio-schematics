import {Import} from "../definitions/import";
import {PathResolutionMap} from "../utils";

import {ParseNodeFunc} from "../utilities";


export type ImportsMapElement = [importName: string, importModule: string]
export type ImportsMapElementExtended<R extends unknown[] = []> = [...args: ImportsMapElement, ...rest: R]
export type ImportsMap<E extends unknown[]> = ImportsMapElementExtended<E>[]


export type ImportsMapOptions = {
  debug?: boolean
  nodeParseFn?: ParseNodeFunc<Import>,
  pathResolutionMap?: PathResolutionMap
}
