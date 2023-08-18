import {PropertyDeclaration} from "../definitions/property";
import {isDecoratedWith, isPublic} from "../definitions/modifiers";



export function getInputs(properties: PropertyDeclaration[]): PropertyDeclaration[] {
  return properties
    .filter(prop => isDecoratedWith('Input', prop))
}

export function getOutputs(properties: PropertyDeclaration[]): string[] {
  return properties
    .filter(prop => isDecoratedWith('Output', prop))
    .map(prop => prop.signature);
}

export function getPublicProperties(properties: PropertyDeclaration[]): string[] {
  return properties
    .filter(prop => isPublic(prop.name, prop))
    .filter(prop => !isDecoratedWith('Input', prop) && !isDecoratedWith('Output', prop))
    .map(prop => prop.signature);
}
