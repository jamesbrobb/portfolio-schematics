import * as ts from "typescript";
export declare const KEYLESS_TOKEN: unique symbol;
export type DecoratorMetadata = {
    [key: string]: unknown;
    [KEYLESS_TOKEN]?: string;
};
export type DecoratorDef<T extends string, M extends DecoratorMetadata> = {
    type: T;
    metadata: M;
    raw: string;
};
export type DirectiveMetadata = {
    selector: string;
    inputs?: string[];
    outputs?: string[];
    providers?: string[];
    exportAs?: string;
    queries?: string[];
    host?: string;
    hostDirectives?: string[];
    standalone?: boolean;
    signals?: string[];
};
export type Directive = DecoratorDef<'Directive', DirectiveMetadata>;
export type ComponentMetadata = {
    changeDetection: string;
    viewProviders?: string[];
    moduleId?: string;
    templateUrl?: string;
    template?: string;
    styles?: string[];
    styleUrls?: string[];
    animations?: string[];
    encapsulation?: string;
    interpolation?: string[];
    preserveWhitespaces?: boolean;
    imports?: string[];
    schemas?: string[];
} & DirectiveMetadata;
export type Component = DecoratorDef<'Component', ComponentMetadata>;
export type PipeMetadata = {
    name: string;
    pure?: boolean;
};
export type Pipe = DecoratorDef<'Pipe', PipeMetadata>;
export type InjectableMetadata = {
    providedIn?: string;
};
export type Injectable = DecoratorDef<'Injectable', InjectableMetadata>;
export type NgModuleMetadata = {
    imports?: string[];
    exports?: string[];
    declarations?: string[];
    providers?: string[];
    entryComponents?: string[];
    bootstrap?: string[];
    schemas?: string[];
    id?: string;
};
export type NgModule = DecoratorDef<'NgModule', NgModuleMetadata>;
export type InputMetadata = {
    [KEYLESS_TOKEN]?: string;
    alias?: string;
    required?: boolean;
    transform?: string;
};
export type Input = DecoratorDef<'Input', InputMetadata>;
export type OutputMetadata = {
    [KEYLESS_TOKEN]?: string;
    alias?: string;
};
export type Output = DecoratorDef<'Output', OutputMetadata>;
export type HostBindingMetadata = {
    [KEYLESS_TOKEN]?: string;
};
export type HostBinding = DecoratorDef<'HostBinding', HostBindingMetadata>;
export type HostListenerMetadata = {
    [KEYLESS_TOKEN]?: string;
    args?: string[];
};
export type HostListener = DecoratorDef<'HostListener', HostListenerMetadata>;
export type ContentChildMetadata = {
    selector?: string;
    read?: string;
    static?: boolean;
};
export type ContentChild = DecoratorDef<'ContentChild', ContentChildMetadata>;
export type ContentChildrenMetadata = {
    selector?: string;
    read?: string;
    descendants?: boolean;
    emitDistinctChangesOnly?: boolean;
    isViewQuery?: boolean;
    first?: boolean;
    static?: boolean;
};
export type ContentChildren = DecoratorDef<'ContentChildren', ContentChildrenMetadata>;
export type ViewChildMetadata = {
    selector?: string;
    read?: string;
    static?: boolean;
};
export type ViewChild = DecoratorDef<'ViewChild', ViewChildMetadata>;
export type ViewChildrenMetadata = {
    selector?: string;
    read?: string;
    descendants?: boolean;
    emitDistinctChangesOnly?: boolean;
    isViewQuery?: boolean;
    first?: boolean;
    static?: boolean;
};
export type ViewChildren = DecoratorDef<'ViewChildren', ViewChildrenMetadata>;
export type QueryMetadata = {
    selector?: string;
    descendants?: boolean;
    read?: string;
    isViewQuery?: boolean;
    first?: boolean;
    static?: boolean;
};
export type Query = DecoratorDef<'Query', QueryMetadata>;
export type ViewQueryMetadata = {
    selector?: string;
    descendants?: boolean;
    read?: string;
    first?: boolean;
    static?: boolean;
};
export type ViewQuery = DecoratorDef<'ViewQuery', ViewQueryMetadata>;
export type Optional = DecoratorDef<'Optional', {}>;
export type Self = DecoratorDef<'Self', {}>;
export type SkipSelf = DecoratorDef<'SkipSelf', {}>;
export type InjectMetadata = {
    token: string;
};
export type Inject = DecoratorDef<'Inject', InjectMetadata>;
export type AttributeMetadata = {
    attributeName: string;
};
export type Attribute = DecoratorDef<'Attribute', AttributeMetadata>;
export type ClassDecorator = Component | Directive | Pipe | Injectable | NgModule;
export type PropertyDecorator = Input | Output | HostBinding | ContentChild | ContentChildren | ViewChild | ViewChildren;
export type MethodDecorator = HostListener;
export type ParameterDecorator = Attribute | Query | ViewQuery | Optional | Self | SkipSelf | Inject;
export type Decorator = ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator;
export declare function getDecorator<T extends Decorator>(node: ts.Decorator, sourceFile: ts.SourceFile): T;
export declare function getDecoratorMetadata<T extends Decorator['metadata']>(node: ts.CallExpression, sourceFile: ts.SourceFile): T;
