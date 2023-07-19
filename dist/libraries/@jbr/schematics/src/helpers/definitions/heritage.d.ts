import * as ts from "typescript";
export type HeritageClause = {
    keyword: 'extends' | 'implements';
    types: string[];
};
export declare function getHeritageClause(node: ts.HeritageClause, sourceFile: ts.SourceFile): HeritageClause;
