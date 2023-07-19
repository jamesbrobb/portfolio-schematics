import { Component, Directive } from "@angular/core";
type GetMetadata<T extends {}> = {
    [K in keyof T]: T[K] extends Array<unknown> ? 'array' : 'string';
};
export type DirectiveMetaData = GetMetadata<Directive>;
export type ComponentMetaData = Component;
export {};
