import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type GetAccessor = {
    name: string;
    type?: string;
    modifiers?: Modifiers;
};
export declare function getGetAccessorDeclaration(node: ts.GetAccessorDeclaration, sourceFile: ts.SourceFile): GetAccessor;
