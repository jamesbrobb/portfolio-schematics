import * as ts from "typescript";
import {Decorator, getDecorator} from "./decorator";
import {getNodesOfKind, getText} from "../utilities";
import {getHeritageClause, HeritageClause} from "./heritage";
import {Constructor, getConstructor} from "./constructor";
import {getPropertyDeclaration, Property} from "./property";
import {getMethodDeclaration, Method} from "./method";
import {GetAccessor, getGetAccessorDeclaration} from "./get-accessor";
import {getSetAccessorDeclaration, SetAccessor} from "./set-accessor";


export enum DefinitionType {
  Decorator = ts.SyntaxKind.Decorator,
  Identifier = ts.SyntaxKind.Identifier,
  HeritageClause = ts.SyntaxKind.HeritageClause,
  Constructor = ts.SyntaxKind.Constructor,
  PropertyDeclaration = ts.SyntaxKind.PropertyDeclaration,
  MethodDeclaration = ts.SyntaxKind.MethodDeclaration,
  GetAccessor = ts.SyntaxKind.GetAccessor,
  SetAccessor = ts.SyntaxKind.SetAccessor
}


export type ClassDeclaration = {
  [DefinitionType.Decorator]?: Decorator,
  [DefinitionType.Identifier]?: string,
  [DefinitionType.HeritageClause]: HeritageClause[],
  [DefinitionType.Constructor]?: Constructor,
  [DefinitionType.PropertyDeclaration]: Property[],
  [DefinitionType.MethodDeclaration]: Method[],
  [DefinitionType.GetAccessor]: GetAccessor[],
  [DefinitionType.SetAccessor]: SetAccessor[]
}

const definitionTypeFunctionMap: {[key in DefinitionType]: unknown} = {
  [DefinitionType.Decorator]: getDecorator,
  [DefinitionType.HeritageClause]: getHeritageClause,
  [DefinitionType.Constructor]: getConstructor,
  [DefinitionType.PropertyDeclaration]: getPropertyDeclaration,
  [DefinitionType.MethodDeclaration]: getMethodDeclaration,
  [DefinitionType.GetAccessor]: getGetAccessorDeclaration,
  [DefinitionType.SetAccessor]: getSetAccessorDeclaration,
  [DefinitionType.Identifier]: (node: ts.Node, sourceFile: ts.SourceFile) => getText(node, sourceFile),
}



export function getClassDeclaration(sourceFile: ts.SourceFile): ClassDeclaration {

  const declaration: ClassDeclaration = {
      [ts.SyntaxKind.Decorator]: undefined,
      [ts.SyntaxKind.Identifier]: undefined,
      [ts.SyntaxKind.HeritageClause]: [],
      [ts.SyntaxKind.Constructor]: undefined,
      [ts.SyntaxKind.PropertyDeclaration]: [],
      [ts.SyntaxKind.MethodDeclaration]: [],
      [ts.SyntaxKind.GetAccessor]: [],
      [ts.SyntaxKind.SetAccessor]: []
    },
    classDec: ts.Node = getNodesOfKind(ts.SyntaxKind.ClassDeclaration, sourceFile)[0];

  if(!classDec) {
    throw new Error("No Class Declaration found");
  }

  classDec.getChildren(sourceFile)
    .map(node => node.kind === ts.SyntaxKind.SyntaxList ? node.getChildren(sourceFile) : node)
    .flat(1)
    .forEach(node => {

      const parseFunc = (definitionTypeFunctionMap as any)[node.kind];

      if(!parseFunc) {
        console.log(`No parse function registered for ${ts.SyntaxKind[node.kind]}`);
        return;
      }

      if(Array.isArray((declaration as any)[node.kind])) {
        (declaration as any)[node.kind].push(parseFunc(node, sourceFile));
        return;
      }

      (declaration as any)[node.kind] = parseFunc(node, sourceFile);
    });

  return declaration
}
