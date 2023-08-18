import * as ts from "typescript";
import { PropertyDeclaration } from "../definitions/property";
import { ImportsMap } from "../imports/imports-map";
import { LocalMap } from "../local/local-map";
export type ControlTypes = 'input' | 'select';
export type Control = {
    controlType: ControlTypes;
    key: string;
    label: string;
    value: any;
    type?: string;
    options?: string;
};
export declare function createControls(inputs: PropertyDeclaration[], importsMap: ImportsMap<[kind?: ts.SyntaxKind]>, localMap: LocalMap): Control[];
