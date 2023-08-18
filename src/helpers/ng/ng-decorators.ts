import {
  Attribute,
  Component,
  ContentChild, ContentChildren,
  Directive,
  HostListener, Inject,
  Injectable,
  Input,
  NgModule,
  Output,
  Pipe,
  ViewChild,
  ViewChildren
} from "@angular/core";

import {DecoratorDef, GetDecoratorMetadata} from "../definitions/decorator";



export type DirectiveMetaData = GetDecoratorMetadata<Directive>
export type DirectiveDef = DecoratorDef<'Directive', DirectiveMetaData>

export type ComponentMetaData = GetDecoratorMetadata<Component>
export type ComponentDef = DecoratorDef<'Component', ComponentMetaData & DirectiveMetaData>

export type PipeMetadata = GetDecoratorMetadata<Pipe>
export type PipeDef = DecoratorDef<'Pipe', PipeMetadata>

export type InjectableMetadata = GetDecoratorMetadata<Injectable>
export type InjectableDef = DecoratorDef<'Injectable', InjectableMetadata>

export type NgModuleMetadata = GetDecoratorMetadata<NgModule>;
export type NgModuleDef = DecoratorDef<'NgModule', NgModuleMetadata>

export type InputMetadata = GetDecoratorMetadata<Input> | string
export type InputDef = DecoratorDef<'Input', InputMetadata>

export type OutputMetadata = GetDecoratorMetadata<Output> | string
export type OutputDef = DecoratorDef<'Output', OutputMetadata>

export type HostBindingMetadata = string
export type HostBindingDef = DecoratorDef<'HostBinding', HostBindingMetadata>

export type HostListenerMetadata = GetDecoratorMetadata<HostListener> | string
export type HostListenerDef = DecoratorDef<'HostListener', HostListenerMetadata>

export type ContentChildMetadata = GetDecoratorMetadata<ContentChild>
export type ContentChildDef = DecoratorDef<'ContentChild', ContentChildMetadata>

export type ContentChildrenMetadata = GetDecoratorMetadata<ContentChildren>
export type ContentChildrenDef = DecoratorDef<'ContentChildren', ContentChildrenMetadata>

export type ViewChildMetadata = GetDecoratorMetadata<ViewChild>
export type ViewChildDef = DecoratorDef<'ViewChild', ViewChildMetadata>;

export type ViewChildrenMetadata = GetDecoratorMetadata<ViewChildren>
export type ViewChildrenDef = DecoratorDef<'ViewChildren', ViewChildrenMetadata>

export type InjectMetadata = GetDecoratorMetadata<Inject>
export type InjectDef = DecoratorDef<'Inject', InjectMetadata>;

export type AttributeMetadata = GetDecoratorMetadata<Attribute>
export type AttributeDef = DecoratorDef<'Attribute', AttributeMetadata>;


export type OptionalDef = DecoratorDef<'Optional', {}>;

export type SelfDef = DecoratorDef<'Self', {}>;

export type SkipSelfDef = DecoratorDef<'SkipSelf', {}>;


export type ClassDecoratorDef = ComponentDef | DirectiveDef | PipeDef | InjectableDef | NgModuleDef;

export type PropertyDecoratorDef = InputDef | OutputDef | HostBindingDef | ContentChildDef | ContentChildrenDef | ViewChildDef | ViewChildrenDef;

export type MethodDecoratorDef = HostListenerDef;

export type ParameterDecoratorDef = AttributeDef | OptionalDef | SelfDef | SkipSelfDef | InjectDef;
