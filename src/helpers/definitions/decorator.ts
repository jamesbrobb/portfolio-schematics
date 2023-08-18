import * as ts from "typescript";
import {
  ClassDecoratorDef,
  MethodDecoratorDef,
  ParameterDecoratorDef,
  PropertyDecoratorDef
} from "../ng/ng-decorators";
import {getText} from "../utils";


export type DecoratorMetadata = {
  [key: string]: string | string[]
}

export type GetDecoratorMetadata<T extends {}> = {
  [K in keyof T]: T[K] extends infer K ? K extends Array<unknown> ? string[] : K extends undefined ? never : string : never
}

export type DecoratorDef<T extends string, M extends DecoratorMetadata | string> = {
  kind: 'decorator'
  type: T,
  metadata?: M,
  raw: string,
  signature: string
}

export type Decorator = ClassDecoratorDef | PropertyDecoratorDef | MethodDecoratorDef | ParameterDecoratorDef;



export function getDecorator<T extends Decorator>(node: ts.Decorator, sourceFile: ts.SourceFile): T {

  if(!ts.isCallLikeExpression(node)) {
    throw new Error("Decorator Node is not a call like expression");
  }

  if (!ts.isCallExpression(node.expression)) {
    throw new Error("Decorator Node.expression is not a call expression");
  }

  const type = node.expression.expression.getText(sourceFile),
    metadata = getDecoratorMetadata<T['metadata']>(node.expression, sourceFile);

  return {
    kind: 'decorator',
    type,
    metadata,
    signature: getDecoratorSignature(type, metadata),
    raw: node.getText(sourceFile)
  } as any
}


function getDecoratorMetadata<T extends Decorator['metadata']>(node: ts.CallExpression, sourceFile: ts.SourceFile): T {

  let metadata: any | string;

  node.arguments.forEach(arg => {

    if (ts.isIdentifier(arg) || ts.isStringLiteral(arg)) {
      metadata = getText(arg, sourceFile);
      return;
    }

    if (ts.isObjectLiteralExpression(arg)) {

      arg.properties.forEach(prop => {

        if (!prop.name || !ts.isIdentifier(prop.name)) {
          throw new Error(`Property name is not an identifier - ${prop}`);
        }

        if (!ts.isPropertyAssignment(prop)) {
          throw new Error(`Property is not a property assignment - ${prop}`);
        }

        const key = prop.name.getText(sourceFile) as keyof T;

        metadata = metadata || {};
        metadata[key] = getText(prop.initializer, sourceFile);
      });
    }
  });

  return metadata
}


function getDecoratorSignature(type: string, metaData: Decorator['metadata']): string {

  if (!metaData) {
    return `@${type}()`;
  }

  if(typeof metaData === 'string') {
    return `@${type}('${metaData}')`;
  }

  const options = Reflect.ownKeys(metaData)
    .map(key => {
      const value = (metaData as any)[key];
      return [key, value];
    })
    .sort((a, b) => a.length - b.length)
    .reduce((accumulator: string, currentValue: string[], currentIndex: number, array: string[][]) => {

      if(currentValue.length === 1) {
        return `${accumulator}'${currentValue[0]}'${currentIndex === array.length - 1 ? '' : ', '}`;
      }

      return `${accumulator}${currentIndex === 0 || array[currentIndex - 1].length === 1 ? '{' : ''}${currentValue[0]}: ${currentValue[1]}${currentIndex === array.length - 1 ? '}' : ', '}`;
    }, '')

  return `@${type}(${options})`;
}
