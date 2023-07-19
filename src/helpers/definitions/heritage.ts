import * as ts from "typescript";


export type HeritageClause = {
  keyword: 'extends' | 'implements',
  types: string[]
}

export function getHeritageClause(node: ts.HeritageClause, sourceFile: ts.SourceFile): HeritageClause {

  const hClause: HeritageClause = {types: []} as any;

  node.getChildren(sourceFile)
    .forEach(node => {

      switch (node.kind) {
        case ts.SyntaxKind.ExtendsKeyword:
          hClause.keyword = 'extends';
          break
        case ts.SyntaxKind.ImplementsKeyword:
          hClause.keyword = 'implements';
          break;
      }

      if(node.kind === ts.SyntaxKind.SyntaxList) {
        node.getChildren(sourceFile)
          .forEach(node => {

            if(node.kind === ts.SyntaxKind.ExpressionWithTypeArguments) {
              hClause.types.push(node.getText(sourceFile));
            }
          });
      }
    });

  return hClause;
}
