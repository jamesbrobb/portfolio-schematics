


export const uiTypes = ['component', 'directive', 'pipe'] as const;
export const nonUiTypes = ['service', 'module', 'class', 'interface', 'enum', 'guard', 'resolver', 'abstract'] as const;
export const allTypes = [...uiTypes, ...nonUiTypes] as const

export type UI_TYPE = typeof uiTypes[number]
export type TYPES = typeof allTypes[number]


export interface Schema {
    path: string
    dir: string
    type: TYPES
}
