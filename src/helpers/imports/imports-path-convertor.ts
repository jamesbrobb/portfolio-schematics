import {ImportsMapElementExtended} from "./imports-map";


export type PathReplacementFn<E extends unknown[]> = (...args: ImportsMapElementExtended<E>) => string;
export type PathConversionMap<E extends unknown[]> = [pathMatch: string | RegExp, replacement: string | PathReplacementFn<E>][];


export function convertPath<E extends unknown[] = []>(result: ImportsMapElementExtended<E>, pathConversionMap: PathConversionMap<E>): ImportsMapElementExtended<E> {
  let [importName, importModule, ...rest] = result;

  pathConversionMap.forEach((value) => {
    let [pathMatch, replacement] = value;

    if(typeof replacement === 'function') {
      replacement = replacement(...result);
    }

    importModule = importModule.replace(pathMatch, replacement)
      .replace('$importName', importName);
  });

  return [importName, importModule, ...rest];
}
