import * as ts from "typescript";
import { Modifiers } from "./modifiers";
import { PropertySignature } from "./property";
export type TypeParameter = {
    kind: 'typeParameter';
    name: string;
    constraint?: string;
    default?: string;
    raw: string;
} & Modifiers;
export type TypeReference = {
    kind: 'typeReference';
    name: string;
    raw: string;
};
export type ExpressionWithTypeArguments = {
    kind: 'expressionWithTypeArguments';
    expression: string;
    typeArguments?: string[];
    raw: string;
};
export type TypeAliasDeclaration = {
    kind: 'typeAliasDeclaration';
    name: string;
    typeParameters?: TypeParameter[];
    type: string;
    raw: string;
} & Modifiers;
export type TypeLiteral = {
    kind: 'typeLiteral';
    members: ({
        kind: number;
        nodeType: string;
        raw: string;
    } | PropertySignature)[];
    raw: string;
};
export type TypeElement = {
    name: string;
    optional?: boolean;
};
export declare function getTypeParameterDeclaration(node: ts.TypeParameterDeclaration, sourceFile: ts.SourceFile): TypeParameter;
export declare function getTypeReference(node: ts.TypeReferenceNode, sourceFile: ts.SourceFile): TypeReference;
export declare function getExpressionWithTypeArguments(node: ts.ExpressionWithTypeArguments, sourceFile: ts.SourceFile): ExpressionWithTypeArguments;
export declare function getTypeAliasDeclaration(node: ts.TypeAliasDeclaration, sourceFile: ts.SourceFile): TypeAliasDeclaration;
export declare function getTypeLiteral(node: ts.TypeLiteralNode, sourceFile: ts.SourceFile): TypeLiteral;
export declare function getTypeElement(node: ts.TypeElement, sourceFile: ts.SourceFile): TypeElement;
export declare function getType(node: ts.Node, sourceFile: ts.SourceFile): string | any;
