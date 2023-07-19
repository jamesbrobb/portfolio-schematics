import * as ts from "typescript";
import {ClassDeclaration, getClassDeclaration} from "./definitions/class";




export function getClassDeclarationFromFile(file: string): ClassDeclaration {

  const program = ts.createProgram([file], { allowJs: true, emitDecoratorMetadata: false, experimentalDecorators: true }),
    sourceFile = program.getSourceFile(file);

  if(!sourceFile) {
    throw new Error(`No source file found for ${file}`);
  }

  return getClassDeclaration(sourceFile);
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


export function getText(node: ts.Node, sourceFile: ts.SourceFile): string {
  return ts.isStringLiteral(node) ? node.text : node.getText(sourceFile)
}
