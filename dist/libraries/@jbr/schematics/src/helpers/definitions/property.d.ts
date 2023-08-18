import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type PropertyDeclaration = {
    kind: 'property';
    name: string;
    optional: boolean;
    exclamation: boolean;
    signature: string;
    raw: string;
    type?: string;
    initializedValue?: string;
} & Modifiers;
export type PropertySignature = {
    kind: 'propertySignature';
    name: string;
    optional: boolean;
    type?: string;
    signature: string;
    raw: string;
} & Modifiers;
export declare function getPropertyDeclaration(node: ts.PropertyDeclaration, sourceFile: ts.SourceFile): PropertyDeclaration;
export declare function getPropertySignature(node: ts.PropertySignature, sourceFile: ts.SourceFile): PropertySignature;
