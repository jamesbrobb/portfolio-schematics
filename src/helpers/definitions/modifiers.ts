import * as ts from "typescript";
import {Decorator, getDecorator} from "./decorator";


export type ModifierKeywords = 'private' | 'protected' | 'public' | 'readonly' | 'static' | 'abstract' | 'async' | 'const' | 'declare' | 'default' | 'export';


export type Modifiers = {
  keywords?: ModifierKeywords[],
  decorators?: Decorator[]
}


const modifiersMap: {[key: number]: ModifierKeywords} = {
  [ts.SyntaxKind.PrivateKeyword]: 'private',
  [ts.SyntaxKind.ProtectedKeyword]: 'protected',
  [ts.SyntaxKind.PublicKeyword]: 'public',
  [ts.SyntaxKind.StaticKeyword]: 'static',
  [ts.SyntaxKind.ReadonlyKeyword]: 'readonly',
  [ts.SyntaxKind.AbstractKeyword]: 'abstract',
  [ts.SyntaxKind.AsyncKeyword]: 'async',
  [ts.SyntaxKind.ConstKeyword]: 'const',
  [ts.SyntaxKind.DeclareKeyword]: 'declare',
  [ts.SyntaxKind.DefaultKeyword]: 'default',
  [ts.SyntaxKind.ExportKeyword]: 'export'
}


export function getModifiers(node: ts.Node, sourceFile: ts.SourceFile): Modifiers | undefined {

  if (!('modifiers' in node) || !Array.isArray(node.modifiers) || node.modifiers.length === 0) {
    return;
  }

  const modifiers: Modifiers = {};

  node.modifiers.forEach(modifier => {

    if(ts.isDecorator(modifier)) {
      if(!modifiers.decorators) {
        modifiers.decorators = [];
      }
      modifiers.decorators.push(getDecorator(modifier, sourceFile));
      return;
    }

    const keyword = modifiersMap[modifier.kind];

    if(keyword) {
      if(!modifiers.keywords) {
        modifiers.keywords = [];
      }
      modifiers.keywords.push(keyword);
    }
  })


  return modifiers;
}


export function isPublic(name: string, modifiers?: Modifiers): boolean {

  return !(isPrivate(name, modifiers) || isProtected(name, modifiers));
}


export function isPrivate(name: string, modifiers?: Modifiers): boolean {

  if(name.startsWith('#')) {
    return true;
  }

  return hasKeyword('private', modifiers);
}

export function isProtected(name: string, modifiers?: Modifiers): boolean {

    if(isPrivate(name, modifiers)) {
      return false;
    }

    return hasKeyword('protected', modifiers);
}

export function isStatic(modifiers?: Modifiers): boolean {
  return hasKeyword('static', modifiers);
}

export function isReadonly(modifiers?: Modifiers): boolean {
  return hasKeyword('readonly', modifiers);
}

export function isAbstract(modifiers?: Modifiers): boolean {
  return hasKeyword('abstract', modifiers);
}

export function isAsync(modifiers?: Modifiers): boolean {
  return hasKeyword('async', modifiers);
}

export function isConst(modifiers?: Modifiers): boolean {
  return hasKeyword('const', modifiers);
}

export function isDeclare(modifiers?: Modifiers): boolean {
  return hasKeyword('declare', modifiers);
}

export function isDefault(modifiers?: Modifiers): boolean {
  return hasKeyword('default', modifiers);
}

export function isExport(modifiers?: Modifiers): boolean {
  return hasKeyword('export', modifiers);
}


export function isDecorated(modifiers?: Modifiers): modifiers is Modifiers & {decorators: Decorator[]} {

  return !(!modifiers || !modifiers.decorators || !modifiers.decorators.length);
}

export function isDecoratedWith(type: string, modifiers?: Modifiers): boolean {

  if(!isDecorated(modifiers)) {
    return false;
  }

  return modifiers.decorators.some(decorator => decorator.type === type);
}

export function getDecoratorsAsString(modifiers?: Modifiers, seperator: string = '\n'): string {

    if(!isDecorated(modifiers)) {
      return '';
    }

    return `${modifiers.decorators
        .map(decorator => decorator.signature)
        .join(seperator)
      }${seperator}`;
}


export function hasKeywords(modifiers?: Modifiers): modifiers is Modifiers & {keywords: ModifierKeywords[]} {

  return !(!modifiers || !modifiers.keywords || !modifiers.keywords.length);
}


export function hasKeyword(keyword: ModifierKeywords, modifiers?: Modifiers): boolean {

  if(!hasKeywords(modifiers)) {
    return false;
  }

  return modifiers.keywords.indexOf(keyword) !== -1;
}

export function getKeywordsAsString(modifiers?: Modifiers, seperator: string = ' ', showPublic: boolean = false): string {

  if(!hasKeywords(modifiers)) {
    return '';
  }

  return `${modifiers.keywords
      .filter(keyword => showPublic || keyword !== 'public')
      .join(seperator)
    }${seperator}`;
}
