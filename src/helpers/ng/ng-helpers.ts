import {Property} from "../definitions/property";
import {isDecoratedWith, isPublic} from "../definitions/modifiers";



export function getInputs(properties: Property[]): string[] {
  return properties
    .filter(prop => isDecoratedWith('Input', prop.modifiers))
    .map(prop => prop.raw);
}

export function getOutputs(properties: Property[]): string[] {
  return properties
    .filter(prop => isDecoratedWith('Output', prop.modifiers))
    .map(prop => prop.raw);
}

export function getPublicProperties(properties: Property[]): string[] {
  return properties
    .filter(prop => isPublic(prop.name, prop.modifiers))
    .filter(prop => !isDecoratedWith('Input', prop.modifiers) && !isDecoratedWith('Output', prop.modifiers))
    .map(prop => prop.signature);
}
