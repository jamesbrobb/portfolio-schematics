import * as ts from "typescript";
import {Decorator} from "./decorator";
import {getNodesOfKind, isParsedResult} from "../utilities";
import {HeritageClause} from "./heritage";
import {Constructor} from "./constructor";
import {PropertyDeclaration} from "./property";
import {Method} from "./method";
import {GetAccessor} from "./get-accessor";
import {SetAccessor} from "./set-accessor";
import {DefinitionTypes, definitionTypeFunctionMap, definitionTypesMap} from "./definition-types";
import {TypeParameter} from "./type";
import {getText} from "../utils";
import {Modifiers} from "./modifiers";
import {Modifier} from "typescript";


export type ClassDec = {
  kind: 'class',
  name: string,
  children?: (Decorator | Modifier | TypeParameter | HeritageClause | Constructor | PropertyDeclaration | Method | GetAccessor | SetAccessor)[]
} & Modifiers


export function getClassDec(node: ts.ClassDeclaration, sourceFile: ts.SourceFile): ClassDec {

  return {
    kind: 'class',
    name: node.name ? getText(node.name, sourceFile) : 'Class name not found',
  }
}


export type ClassDeclaration = {
  [DefinitionTypes.IMPORT]: string[],
  [DefinitionTypes.DECORATOR]?: Decorator,
  [DefinitionTypes.NAME]?: string,
  [DefinitionTypes.TYPE_PARAMETER]?: TypeParameter,
  [DefinitionTypes.HERITAGE]: HeritageClause[],
  [DefinitionTypes.CONSTRUCTOR]?: Constructor,
  [DefinitionTypes.PROPERTY]: PropertyDeclaration[],
  [DefinitionTypes.METHOD]: Method[],
  [DefinitionTypes.GETTER]: GetAccessor[],
  [DefinitionTypes.SETTER]: SetAccessor[]
}


export function getClassDeclaration(sourceFile: ts.SourceFile): ClassDeclaration {

  const declaration: ClassDeclaration = {
      import: [],
      decorator: undefined,
      name: undefined,
      typeParameter: undefined,
      heritage: [],
      cnstructor: undefined,
      property: [],
      method: [],
      getter: [],
      setter: []
    },
    classDec: ts.Node = getNodesOfKind(ts.SyntaxKind.ClassDeclaration, sourceFile)[0];

  if(!classDec) {
    throw new Error("No Class Declaration found");
  }

  classDec.getChildren(sourceFile)
    .map(node => node.kind === ts.SyntaxKind.SyntaxList ? node.getChildren(sourceFile) : node)
    .flat(1)
    .forEach(node => {

      const parseFunc = definitionTypeFunctionMap[node.kind];

      if(!parseFunc) {
        console.log(`No parse function registered for ${ts.SyntaxKind[node.kind]}`);
        console.log(node.kind);
        console.log(getText(node, sourceFile));
        console.log('-------------------');
        return;
      }

      const defType = definitionTypesMap[node.kind];

      if(!defType) {
        console.log(`No definition type registered for ${ts.SyntaxKind[node.kind]}`);
        return;
      }

      if(Array.isArray((declaration as any)[defType])) {
        let res = parseFunc(node, sourceFile) as any;

        if(isParsedResult<any>(res)) {
          res = res.result;
        }

        ((declaration as any)[defType] as Array<any>).push(res);
        return;
      }

      let res = parseFunc(node, sourceFile) as any;

      if(isParsedResult<any>(res)) {
        res = res.result;
      }

      (declaration as any)[defType] = res;
    });

  return declaration
}
