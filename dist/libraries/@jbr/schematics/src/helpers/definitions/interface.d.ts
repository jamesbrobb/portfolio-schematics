import * as ts from "typescript";
import { Modifiers } from "./modifiers";
export type Interface = {
    kind: 'interface';
    name: string;
    isExported?: boolean;
} & Modifiers;
export declare function getInterfaceDeclaration(node: ts.InterfaceDeclaration, sourceFile: ts.SourceFile): Interface;
