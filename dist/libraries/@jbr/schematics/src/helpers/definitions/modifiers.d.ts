import * as ts from "typescript";
import { Decorator } from "./decorator";
export type ModifierKeywords = 'private' | 'protected' | 'public' | 'readonly' | 'static' | 'abstract' | 'async' | 'const' | 'declare' | 'default' | 'export';
export type Modifiers = {
    keywords?: ModifierKeywords[];
    decorators?: Decorator[];
};
export declare function getModifiers(node: ts.Node, sourceFile: ts.SourceFile): Modifiers | undefined;
export declare function isPublic(name: string, modifiers?: Modifiers): boolean;
export declare function isPrivate(name: string, modifiers?: Modifiers): boolean;
export declare function isProtected(name: string, modifiers?: Modifiers): boolean;
export declare function isStatic(modifiers?: Modifiers): boolean;
export declare function isReadonly(modifiers?: Modifiers): boolean;
export declare function isAbstract(modifiers?: Modifiers): boolean;
export declare function isAsync(modifiers?: Modifiers): boolean;
export declare function isConst(modifiers?: Modifiers): boolean;
export declare function isDeclare(modifiers?: Modifiers): boolean;
export declare function isDefault(modifiers?: Modifiers): boolean;
export declare function isExport(modifiers?: Modifiers): boolean;
export declare function isDecorated(modifiers?: Modifiers): modifiers is Modifiers & {
    decorators: Decorator[];
};
export declare function isDecoratedWith(type: string, modifiers?: Modifiers): boolean;
export declare function getDecoratorsAsString(modifiers?: Modifiers, seperator?: string): string;
export declare function hasKeywords(modifiers?: Modifiers): modifiers is Modifiers & {
    keywords: ModifierKeywords[];
};
export declare function hasKeyword(keyword: ModifierKeywords, modifiers?: Modifiers): boolean;
export declare function getKeywordsAsString(modifiers?: Modifiers, seperator?: string, showPublic?: boolean): string;
