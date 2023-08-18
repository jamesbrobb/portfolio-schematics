import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type GetAccessor = {
    kind: 'getter';
    name: string;
    type?: string;
} & Modifiers;
export declare function getGetAccessorDeclaration(node: ts.GetAccessorDeclaration, sourceFile: ts.SourceFile): GetAccessor;
