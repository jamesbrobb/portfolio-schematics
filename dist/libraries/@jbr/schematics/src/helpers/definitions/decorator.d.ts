import * as ts from "typescript";
import { ClassDecoratorDef, MethodDecoratorDef, ParameterDecoratorDef, PropertyDecoratorDef } from "../ng/ng-decorators";
export declare const KEYLESS_TOKEN: unique symbol;
export type DecoratorMetadata = {
    [key: string]: unknown;
    [KEYLESS_TOKEN]?: string;
};
export type DecoratorDef<T extends string, M extends DecoratorMetadata> = {
    type: T;
    metadata: M;
    raw: string;
    signature: string;
};
export type Decorator = ClassDecoratorDef | PropertyDecoratorDef | MethodDecoratorDef | ParameterDecoratorDef;
export declare function getDecorator<T extends Decorator>(node: ts.Decorator, sourceFile: ts.SourceFile): T;
