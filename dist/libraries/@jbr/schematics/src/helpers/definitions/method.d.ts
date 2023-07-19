import * as ts from "typescript";
import { Parameter } from "./parameter";
import { Modifiers } from "./modifiers";
export type Method = {
    name: string;
    signature: string;
    parameters: Parameter[];
    type?: string;
    modifiers?: Modifiers;
};
export declare function getMethodDeclaration(node: ts.MethodDeclaration, sourceFile: ts.SourceFile): Method;
export declare function getPublicMethodSignatures(methods: Method[]): string[];
