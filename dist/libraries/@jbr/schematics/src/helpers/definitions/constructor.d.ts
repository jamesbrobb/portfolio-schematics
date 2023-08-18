import * as ts from "typescript";
import { Parameter } from "./parameter";
export type Constructor = {
    kind: 'constructor';
    parameters: Parameter[];
};
export declare function getConstructor(node: ts.ConstructorDeclaration, sourceFile: ts.SourceFile): Constructor;
