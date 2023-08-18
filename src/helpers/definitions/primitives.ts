import * as ts from "typescript";


export type TupleDeclaration = {
  raw: string
}


export function getTupleDeclaration(node: ts.TupleTypeNode, sourceFile: ts.SourceFile): TupleDeclaration {

  return {
    raw: node.getText(sourceFile)
  }
}
