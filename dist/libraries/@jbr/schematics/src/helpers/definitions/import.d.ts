import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type Import = {
    kind: 'import';
    module: string;
    raw: string;
    children?: ImportClause[];
} & Modifiers;
export type ImportClause = {
    kind: 'importClause';
    name?: string;
    isTypeOnly?: boolean;
    raw: string;
    children?: NamedImports[];
};
export type NamedImports = {
    kind: 'namedImports';
    raw: string;
    children?: ImportSpecifier[];
};
export type ImportSpecifier = {
    kind: 'importSpecifier';
    name: string;
    propertyName?: string;
    raw: string;
};
export type NamespaceImport = {
    kind: 'namespaceImport';
    name: string;
    raw: string;
};
export declare function isImportDeclaration(result: any): result is Import;
export declare function getImportDeclaration(node: ts.ImportDeclaration, sourceFile: ts.SourceFile): Import;
export declare function getNamedImports(node: ts.NamedImports, sourceFile: ts.SourceFile): NamedImports;
export declare function getImportClause(node: ts.ImportClause, sourceFile: ts.SourceFile): ImportClause;
export declare function getImportSpecifier(node: ts.ImportSpecifier, sourceFile: ts.SourceFile): ImportSpecifier;
export declare function getNamespaceImport(node: ts.NamespaceImport, sourceFile: ts.SourceFile): NamespaceImport;
