import * as ts from "typescript";
import {getModifiers, Modifiers} from "./modifiers";
import {getText} from "../utils";


export type Import = {
  kind: 'import',
  module: string,
  raw: string,
  children?: ImportClause[]
} & Modifiers

export type ImportClause = {
  kind: 'importClause'
  name?: string,
  isTypeOnly?: boolean,
  raw: string,
  children?: NamedImports[]
}

export type NamedImports = {
  kind: 'namedImports',
  raw: string,
  children?: ImportSpecifier[]
}

export type ImportSpecifier = {
  kind: 'importSpecifier',
  name: string,
  propertyName?: string,
  raw: string
}

export type NamespaceImport = {
  kind: 'namespaceImport'
  name: string,
  raw: string
}


export function isImportDeclaration(result: any): result is Import {
  return 'kind' in result && result.kind === 'import'
}

export function getImportDeclaration(node: ts.ImportDeclaration, sourceFile: ts.SourceFile): Import {

  const module = getText(node.moduleSpecifier, sourceFile),
    modifiers = getModifiers(node, sourceFile) || {};

  return {
    kind: 'import',
    module,
    raw: node.getText(sourceFile),
    ...modifiers
  };
}


export function getNamedImports(node: ts.NamedImports, sourceFile: ts.SourceFile): NamedImports {
  return {
    kind: 'namedImports',
    raw: node.getText(sourceFile)
  }
}

export function getImportClause(node: ts.ImportClause, sourceFile: ts.SourceFile): ImportClause {

    const name = node.name ? getText(node.name, sourceFile) : undefined;

    return {
      kind: 'importClause',
      name,
      isTypeOnly: node.isTypeOnly,
      raw: node.getText(sourceFile)
    }
}

export function getImportSpecifier(node: ts.ImportSpecifier, sourceFile: ts.SourceFile): ImportSpecifier {

    const name = getText(node.name, sourceFile),
      propertyName = node.propertyName ? getText(node.propertyName, sourceFile) : undefined;

    return {
      kind: 'importSpecifier',
      name,
      propertyName,
      raw: node.getText(sourceFile)
    }
}

export function getNamespaceImport(node: ts.NamespaceImport, sourceFile: ts.SourceFile): NamespaceImport {

    const name = getText(node.name, sourceFile);

    return {
      kind: 'namespaceImport',
      name,
      raw: node.getText(sourceFile)
    }
}
