import * as ts from "typescript";
export type getDefinition<T extends ts.Node> = (node: T, sourceFile: ts.SourceFile) => any;