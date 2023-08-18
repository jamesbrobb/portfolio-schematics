import * as ts from "typescript";
import { ClassDecoratorDef, MethodDecoratorDef, ParameterDecoratorDef, PropertyDecoratorDef } from "../ng/ng-decorators";
export type DecoratorMetadata = {
    [key: string]: string | string[];
};
export type GetDecoratorMetadata<T extends {}> = {
    [K in keyof T]: T[K] extends infer K ? K extends Array<unknown> ? string[] : K extends undefined ? never : string : never;
};
export type DecoratorDef<T extends string, M extends DecoratorMetadata | string> = {
    kind: 'decorator';
    type: T;
    metadata?: M;
    raw: string;
    signature: string;
};
export type Decorator = ClassDecoratorDef | PropertyDecoratorDef | MethodDecoratorDef | ParameterDecoratorDef;
export declare function getDecorator<T extends Decorator>(node: ts.Decorator, sourceFile: ts.SourceFile): T;
