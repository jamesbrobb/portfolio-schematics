import { ImportsMapElementExtended } from "./imports-map";
export type PathReplacementFn<E extends unknown[]> = (...args: ImportsMapElementExtended<E>) => string;
export type PathConversionMap<E extends unknown[]> = [pathMatch: string | RegExp, replacement: string | PathReplacementFn<E>][];
export declare function convertPath<E extends unknown[] = []>(result: ImportsMapElementExtended<E>, pathConversionMap: PathConversionMap<E>): ImportsMapElementExtended<E>;
