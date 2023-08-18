import * as ts from "typescript";
export type HeritageClause = {
    kind: 'heritage';
    keyword: 'extends' | 'implements';
    types: string[];
};
export declare function getHeritageClause(node: ts.HeritageClause, sourceFile: ts.SourceFile): HeritageClause;
export declare function getHeritageClausesByType(type: 'extends' | 'implements', clauses: HeritageClause[]): string[][];
