import * as ts from "typescript";
import { Decorator } from "./decorators";
import { Constructor, GetAccessor, HeritageClause, Method, Property, SetAccessor } from "./definition-types";
export declare enum DefinitionType {
    Decorator = 169,
    Identifier = 80,
    HeritageClause = 297,
    Constructor = 175,
    PropertyDeclaration = 171,
    MethodDeclaration = 173,
    GetAccessor = 176,
    SetAccessor = 177
}
export type ClassDeclaration = {
    [DefinitionType.Decorator]?: Decorator;
    [DefinitionType.Identifier]?: string;
    [DefinitionType.HeritageClause]: HeritageClause[];
    [DefinitionType.Constructor]?: Constructor;
    [DefinitionType.PropertyDeclaration]: Property[];
    [DefinitionType.MethodDeclaration]: Method[];
    [DefinitionType.GetAccessor]: GetAccessor[];
    [DefinitionType.SetAccessor]: SetAccessor[];
};
export declare function getClassDeclaration(sourceFile: ts.SourceFile): ClassDeclaration;
