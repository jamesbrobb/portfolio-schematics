import * as ts from "typescript";
import {PropertyDeclaration} from "../definitions/property";
import {strings} from "@angular-devkit/core";
import {ImportsMap} from "../imports/imports-map";
import {LocalMap} from "../local/local-map";


export type ControlTypes = 'input' | 'select';

export type Control = {
  controlType: ControlTypes,
  key: string,
  label: string,
  value: any,
  type?: string,
  options?: string
}

type InputType = Pick<Control, 'controlType' | 'type' | 'options'>;
type InputTypeMap = {[key in `${ts.SyntaxKind}`]?: InputType} & {[key: string]: InputType};


const inputTypeMap: InputTypeMap = {
  'boolean': {controlType: 'input', type: 'checkbox'},
  'string': {controlType: 'input', type: 'text'},
  'number': {controlType: 'input', type: 'number'},
  'Date': {controlType: 'input', type: 'date'},
  [ts.SyntaxKind.EnumDeclaration]: {controlType: 'select', options: '$type'}
}


export function createControls(inputs: PropertyDeclaration[], importsMap: ImportsMap<[kind?: ts.SyntaxKind]>, localMap: LocalMap): Control[] {

  return inputs.map(input => ({
      ...getInputType(input, importsMap, localMap),
      key: getKey(input),
      label: strings.capitalize(strings.dasherize(input.name)).replace(/-/g, ' '),
      value: input.initializedValue
    }));
}

function getKey(input: PropertyDeclaration): string {

  let key = input.name;

  input.decorators?.forEach(decorator => {

    if(decorator.metadata && typeof decorator.metadata === 'string') {
      key = decorator.metadata;
    }
  });

  return key;
}

function getInputType(input: PropertyDeclaration, importsMap: ImportsMap<[kind?: ts.SyntaxKind]>, localMap: Map<string, [ts.SyntaxKind, ts.Declaration]>): InputType {

  let kind: string | ts.SyntaxKind = input.type || '';

  const local = localMap.get(kind);

  if(local) {
    kind = local[0];
  }

  if(!local) {

    const imprt = importsMap.find(([importName, _importModule, _kind]) => {
      return importName.includes(input.type || '');
    });

    if(imprt) {
      kind = imprt[2] || input.type || '';
    }
  }

  const type = inputTypeMap[kind];

  if(!type) {
    console.warn(`No input type found for ${input.name} of type ${kind} - returning default input type`);
    return {controlType: 'input'};
  }

  if(type.options === '$type') {
    type.options = input.type || '';
  }

  return type ;
}
