import * as ts from "typescript";
export type TupleDeclaration = {
    raw: string;
};
export declare function getTupleDeclaration(node: ts.TupleTypeNode, sourceFile: ts.SourceFile): TupleDeclaration;
