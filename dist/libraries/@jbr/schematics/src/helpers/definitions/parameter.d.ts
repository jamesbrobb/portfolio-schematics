import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type Parameter = {
    kind: 'parameter';
    name: string;
    optional: boolean;
    signature: string;
    type?: string;
    initializedValue?: string;
    raw: string;
} & Modifiers;
export declare function getParameter(node: ts.ParameterDeclaration, sourceFile: ts.SourceFile): Parameter;
export declare function getParametersAsString(parameters: Parameter[], seperator?: string): string;
