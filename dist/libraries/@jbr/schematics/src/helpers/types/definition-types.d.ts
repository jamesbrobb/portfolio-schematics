import * as ts from "typescript";
import { Decorator } from "./decorators";
export type HeritageClause = {
    keyword: 'extends' | 'implements';
    types: string[];
};
export type Constructor = {
    parameters: Parameter[];
};
export type ModifierKeywords = 'private' | 'protected' | 'public' | 'readonly' | 'static' | 'abstract' | 'async' | 'const' | 'declare' | 'default' | 'export';
export type Modifiers = {
    keywords?: ModifierKeywords[];
    decorators?: Decorator[];
};
export type Parameter = {
    name: string;
    type?: string;
    optional: boolean;
    modifiers?: Modifiers;
};
export type Property = {
    name: string;
    isPublic: boolean;
    isDecorated: boolean;
    optional: boolean;
    exclamation: boolean;
    raw: string;
    type?: string;
    modifiers?: Modifiers;
    initializedValue?: string;
};
export type Method = {
    name: string;
    signature: string;
    isPublic: boolean;
    parameters: Parameter[];
    type?: string;
    modifiers?: Modifiers;
};
export type GetAccessor = {
    name: string;
    type?: string;
    modifiers?: Modifiers;
};
export type SetAccessor = {
    name: string;
    type?: string;
    parameters: Parameter[];
    modifiers?: Modifiers;
};
export type getDefinition<T extends ts.Node> = (node: T, sourceFile: ts.SourceFile) => any;
export declare function getModifiers(node: ts.Node, sourceFile: ts.SourceFile): Modifiers | undefined;
export declare function getParameter(node: ts.ParameterDeclaration, sourceFile: ts.SourceFile): Parameter;
export declare function getHeritageClause(node: ts.HeritageClause, sourceFile: ts.SourceFile): HeritageClause;
export declare function getConstructor(node: ts.ConstructorDeclaration, sourceFile: ts.SourceFile): Constructor;
export declare function getPropertyDeclaration(node: ts.PropertyDeclaration, sourceFile: ts.SourceFile): Property;
export declare function getMethodDeclaration(node: ts.MethodDeclaration, sourceFile: ts.SourceFile): Method;
export declare function getGetAccessorDeclaration(node: ts.GetAccessorDeclaration, sourceFile: ts.SourceFile): GetAccessor;
export declare function getSetAccessorDeclaration(node: ts.SetAccessorDeclaration, sourceFile: ts.SourceFile): SetAccessor;
