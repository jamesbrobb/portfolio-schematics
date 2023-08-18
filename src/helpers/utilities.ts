import * as ts from "typescript";
import {ClassDeclaration, getClassDeclaration} from "./definitions/class";
import {convertSourceFileToSymbol} from "./symbol-helper";



export function getClassDeclarationFromFile(file: string): ClassDeclaration {

  const program = ts.createProgram([file], { allowJs: true, emitDecoratorMetadata: false, experimentalDecorators: true }),
    sourceFile = program.getSourceFile(file);

  if(!sourceFile) {
    throw new Error(`No source file found for ${file}`);
  }

  return getClassDeclaration(sourceFile);
}


export type ParsedResult<R> = {result: R, exit: boolean};

export function isParsedResult<R>(result: any): result is ParsedResult<R> {
  return typeof result === 'object' && 'result' in result && 'exit' in result;
}


export type GetNodeKeyFunc = (node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean) => PropertyKey;
export type ParseNodeFunc<R> = (node: ts.Node, sourceFile: ts.SourceFile, debug?: boolean) => R | ParsedResult<R>;

export type Options<R> = {
  keyMapFn?: GetNodeKeyFunc,
  nodeParseFn?: ParseNodeFunc<R>,
  returnArray?: boolean,
  lazy?: boolean,
  debug?: boolean
}


export function walkTree<R = ts.Node>(node: ts.Node, sourceFile: ts.SourceFile, options?: Options<R>): any[] | Record<PropertyKey, unknown> {

  const parseFn: ParseNodeFunc<R> = options?.nodeParseFn || ((node: ts.Node): R => node as R),
    children: any[] = [];

  let parsed: R | (() => R),
    exit = false;

  if(options?.lazy) {

    parsed = (() => {

      let parsedNode: R;

      return () => {

        if(!parsedNode) {

          const res = parseFn(node, sourceFile, options?.debug);

          parsedNode = isParsedResult<R>(res) ? res.result : res;
        }

        return parsedNode;
      }
    })();

  } else {

    const res = parseFn(node, sourceFile, options?.debug);

    if(isParsedResult<R>(res)) {
      parsed = res.result;
      exit = res.exit;
    } else {
      parsed = res;
    }
  }

  if(!exit && node.getChildCount(sourceFile) >= 0) {
    node.forEachChild(childNode => {
      children.push(walkTree(childNode, sourceFile, options));
    });
  }

  if(options?.returnArray) {
    return children.length ? [parsed, children] : [parsed];
  }

  if(children.length) {
    (parsed as any)['children'] = children;
  }

  return parsed as any;
}


export function parseSourceFile<R = ts.Node>(program: ts.Program, sourceFile: ts.SourceFile, options?:Options<R>): any[] | {} {

  const results = getExportedDeclarationsFromSource(program, sourceFile)
    .map(declaration => walkTree(declaration, sourceFile, options));

  if(options?.debug) {
    logResults(results);
  }

  return results
}





export function getExportedDeclarationsFromSource(program: ts.Program, sourceFile: ts.SourceFile): ts.Declaration[] {

  const symbol = convertSourceFileToSymbol(program, sourceFile),
    typeChecker = program.getTypeChecker();

  if(!symbol) {
    return [];
  }

  return typeChecker.getExportsOfModule(symbol)
    .map(value => value.declarations?.[0])
    .filter((declaration): declaration is ts.Declaration => !!declaration);
}

function logResults(results: any[]) {
  results.forEach(result =>
    console.log(JSON.stringify(Array.isArray(result) ? {result} : result, null, 2))
  );
}


export function getAllNodesFromSource(sourceFile: ts.SourceFile): ts.Node[] {
  const nodes: ts.Node[] = [sourceFile];
  const result: ts.Node[] = [];

  while (nodes.length > 0) {
    const node = nodes.shift();

    if (node) {
      result.push(node);

      if (node.getChildCount(sourceFile) >= 0) {
        nodes.unshift(...node.getChildren());
      }
    }
  }

  return result;
}

export function getNodesOfKind<T extends ts.Node>(
  kind: ts.SyntaxKind,
  sourceFile: ts.SourceFile,
  nodes?: ts.Node[],
  findAll: boolean = false,
): T[] {

  nodes = nodes || sourceFile.getChildren();

  const matches: T[] = [];

  nodes.forEach(node => {

    if (node.kind === kind) {
      matches.push(node as T);
    }

    if ((findAll || !matches.length) && node.getChildCount(sourceFile) >= 0) {
      matches.push(...getNodesOfKind<T>(kind, sourceFile, node.getChildren(sourceFile), findAll));
    }
  });

  return matches;
}
