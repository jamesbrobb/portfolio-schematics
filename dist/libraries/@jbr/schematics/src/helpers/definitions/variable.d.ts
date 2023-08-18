import * as ts from "typescript";
export type VariableDeclaration = {
    kind: 'variableDeclaration';
    name: string;
    type?: string;
    exclamationToken?: string;
    initializer?: string;
    raw: string;
};
export declare function getVariableDeclaration(node: ts.VariableDeclaration, sourceFile: ts.SourceFile): VariableDeclaration;
