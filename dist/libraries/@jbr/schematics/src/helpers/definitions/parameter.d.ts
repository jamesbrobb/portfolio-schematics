import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type Parameter = {
    name: string;
    optional: boolean;
    signature: string;
    type?: string;
    modifiers?: Modifiers;
};
export declare function getParameter(node: ts.ParameterDeclaration, sourceFile: ts.SourceFile): Parameter;
export declare function getParametersAsString(parameters: Parameter[], seperator?: string): string;
