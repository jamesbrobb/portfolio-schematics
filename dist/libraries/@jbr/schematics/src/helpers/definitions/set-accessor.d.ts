import * as ts from "typescript";
import { Modifiers } from "./modifiers";
import { Parameter } from "./parameter";
export type SetAccessor = {
    kind: 'setter';
    name: string;
    type?: string;
    parameters: Parameter[];
} & Modifiers;
export declare function getSetAccessorDeclaration(node: ts.SetAccessorDeclaration, sourceFile: ts.SourceFile): SetAccessor;
