export declare const uiTypes: readonly ["component", "directive", "pipe"];
export declare const nonUiTypes: readonly ["service", "module", "class", "interface", "enum", "guard", "resolver", "abstract"];
export declare const allTypes: readonly ["component", "directive", "pipe", "service", "module", "class", "interface", "enum", "guard", "resolver", "abstract"];
export type UI_TYPE = typeof uiTypes[number];
export type TYPES = typeof allTypes[number];
export interface Schema {
    path: string;
    dir: string;
    type: TYPES;
}
