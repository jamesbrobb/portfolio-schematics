import { Component, Directive } from "@angular/core";
import { DecoratorDef, KEYLESS_TOKEN } from "../definitions/decorator";
type GetMetadata<T extends {}> = {
    [K in keyof T]: T[K] extends Array<unknown> ? 'array' : 'string';
};
export type DirectiveMetaData = GetMetadata<Directive>;
export type ComponentMetaData = Component;
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
export type DirectiveDef = DecoratorDef<'Directive', DirectiveMetadata>;
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
export type ComponentDef = DecoratorDef<'Component', ComponentMetadata>;
export type PipeMetadata = {
    name: string;
    pure?: boolean;
};
export type PipeDef = DecoratorDef<'Pipe', PipeMetadata>;
export type InjectableMetadata = {
    providedIn?: string;
};
export type InjectableDef = DecoratorDef<'Injectable', InjectableMetadata>;
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
export type NgModuleDef = DecoratorDef<'NgModule', NgModuleMetadata>;
export type InputMetadata = {
    [KEYLESS_TOKEN]?: string;
    alias?: string;
    required?: boolean;
    transform?: string;
};
export type InputDef = DecoratorDef<'Input', InputMetadata>;
export type OutputMetadata = {
    [KEYLESS_TOKEN]?: string;
    alias?: string;
};
export type OutputDef = DecoratorDef<'Output', OutputMetadata>;
export type HostBindingMetadata = {
    [KEYLESS_TOKEN]?: string;
};
export type HostBindingDef = DecoratorDef<'HostBinding', HostBindingMetadata>;
export type HostListenerMetadata = {
    [KEYLESS_TOKEN]?: string;
    args?: string[];
};
export type HostListenerDef = DecoratorDef<'HostListener', HostListenerMetadata>;
export type ContentChildMetadata = {
    selector?: string;
    read?: string;
    static?: boolean;
};
export type ContentChildDef = DecoratorDef<'ContentChild', ContentChildMetadata>;
export type ContentChildrenMetadata = {
    selector?: string;
    read?: string;
    descendants?: boolean;
    emitDistinctChangesOnly?: boolean;
    isViewQuery?: boolean;
    first?: boolean;
    static?: boolean;
};
export type ContentChildrenDef = DecoratorDef<'ContentChildren', ContentChildrenMetadata>;
export type ViewChildMetadata = {
    selector?: string;
    read?: string;
    static?: boolean;
};
export type ViewChildDef = DecoratorDef<'ViewChild', ViewChildMetadata>;
export type ViewChildrenMetadata = {
    selector?: string;
    read?: string;
    descendants?: boolean;
    emitDistinctChangesOnly?: boolean;
    isViewQuery?: boolean;
    first?: boolean;
    static?: boolean;
};
export type ViewChildrenDef = DecoratorDef<'ViewChildren', ViewChildrenMetadata>;
export type QueryMetadata = {
    selector?: string;
    descendants?: boolean;
    read?: string;
    isViewQuery?: boolean;
    first?: boolean;
    static?: boolean;
};
export type QueryDef = DecoratorDef<'Query', QueryMetadata>;
export type ViewQueryMetadata = {
    selector?: string;
    descendants?: boolean;
    read?: string;
    first?: boolean;
    static?: boolean;
};
export type ViewQueryDef = DecoratorDef<'ViewQuery', ViewQueryMetadata>;
export type OptionalDef = DecoratorDef<'Optional', {}>;
export type SelfDef = DecoratorDef<'Self', {}>;
export type SkipSelfDef = DecoratorDef<'SkipSelf', {}>;
export type InjectMetadata = {
    token: string;
};
export type InjectDef = DecoratorDef<'Inject', InjectMetadata>;
export type AttributeMetadata = {
    attributeName: string;
};
export type AttributeDef = DecoratorDef<'Attribute', AttributeMetadata>;
export type ClassDecoratorDef = ComponentDef | DirectiveDef | PipeDef | InjectableDef | NgModuleDef;
export type PropertyDecoratorDef = InputDef | OutputDef | HostBindingDef | ContentChildDef | ContentChildrenDef | ViewChildDef | ViewChildrenDef;
export type MethodDecoratorDef = HostListenerDef;
export type ParameterDecoratorDef = AttributeDef | QueryDef | ViewQueryDef | OptionalDef | SelfDef | SkipSelfDef | InjectDef;
export {};
