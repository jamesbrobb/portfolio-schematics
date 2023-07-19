import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type Property = {
    name: string;
    optional: boolean;
    exclamation: boolean;
    signature: string;
    raw: string;
    type?: string;
    modifiers?: Modifiers;
    initializedValue?: string;
};
export declare function getPropertyDeclaration(node: ts.PropertyDeclaration, sourceFile: ts.SourceFile): Property;
