import * as ts from "typescript";
import {apply, applyTemplates, mergeWith, move, Rule, SchematicContext, Tree, url} from '@angular-devkit/schematics';
import {Schema} from "./schema";
import {parseSourceFile} from "../helpers/utilities";
import {DefinitionTypes, parseDefinition} from "../helpers/definitions/definition-types";
import {getParsedConfig} from "../helpers/ts-config-parser";
import {parse, relative} from "path";
import {ClassDec} from "../helpers/definitions/class";
import {getHeritageClausesByType, HeritageClause} from "../helpers/definitions/heritage";
import {getInputs, getOutputs, getPublicProperties} from "../helpers/ng/ng-helpers";
import {getPublicMethodSignatures, Method} from "../helpers/definitions/method";
import {PropertyDeclaration} from "../helpers/definitions/property";
import {ComponentMetaData, DirectiveMetaData} from "../helpers/ng/ng-decorators";
import {DecoratorDef} from "../helpers/definitions/decorator";
import {normalize, strings} from "@angular-devkit/core";
import {WorkspaceDefinition} from "@angular-devkit/core/src/workspace";
import {getWorkspace as getWS} from "@schematics/angular/utility/workspace";
import {DuplicatePathPrecedenceMap, PathResolutionMap} from "../helpers/utils";
import {
    createSourceFileMap,
    IgnorePathsMap,
} from "../helpers/source-files/source-file-map-factory";
import {convertPath, PathConversionMap, PathReplacementFn} from "../helpers/imports/imports-path-convertor";
import {createImportsMap} from "../helpers/imports/imports-map-factory";
import {ImportsMap, ImportsMapElementExtended} from "../helpers/imports/imports-map";
import {createLocalMap} from "../helpers/local/local-map";
import {createControls} from "../helpers/controls/create-controls";


export const uiTypes = ['component', 'directive', 'pipe'] as const;
export const nonUiTypes = ['service', 'module', 'class', 'interface', 'enum', 'guard', 'resolver', 'abstract'] as const;
export const allTypes = [...uiTypes, ...nonUiTypes] as const

export type UI_TYPE = typeof uiTypes[number]
export type TYPES = typeof allTypes[number]


const ignorePathsMap: IgnorePathsMap = [
    'tslib',
    'public-api',
    /^(?!.*@angular).*?\/index((\.d)*?\.ts)*?$/g,
    '@juggle/resize-observer/lib/exports',
    'rxjs/dist/types/internal/types',
];

const pathResolutionMap: PathResolutionMap = [
    [/^.*?\/node_modules\/(.*?)(?:\/index)?$/g, '$1'],
    [/^.*?\/jbr\/(?:dist\/)?libraries\/(?:@jbr\/)?(.*?)$/g, '@jbr/$1'],
];

const duplicatePrecedenceMap: DuplicatePathPrecedenceMap = [
    ['rxjs/dist/types/internal/operators', 0],
    ['rxjs/dist/types/internal/observable', 1],
];


const rxjsTypeMap: Record<string, string> = {
    [ts.SyntaxKind.ClassDeclaration]: 'class',
    [ts.SyntaxKind.FunctionDeclaration]: 'function',
    [ts.SyntaxKind.TypeAliasDeclaration]: 'type-alias',
    [ts.SyntaxKind.InterfaceDeclaration]: 'interface',
    [ts.SyntaxKind.VariableDeclaration]: 'const'
}

const rxjsPathReplaceFn: PathReplacementFn<[ts.SyntaxKind]> = (_importName, _importModule, kind) => {
    return `https://rxjs.dev/api/index/${rxjsTypeMap[kind || ''] || '' }/`;
}

const pathConversionMap: PathConversionMap<[ts.SyntaxKind]> = [
    [/^rxjs(.*[\\\/])/g, rxjsPathReplaceFn],
    [/^@angular\/(.*?)$/g, 'https://angular.io/api/$1/$importName'],
    [/^@jbr\/([^\/]*)(?:\/src)?\/lib/g, 'libraries/$1'],
];



export function tscTest(options: Schema): Rule {

    return async (tree: Tree, _context: SchematicContext) => {

        const config = getParsedConfig();

        const  program = createProgram(config.fileNames[0], config.options),
          sourceFile = getSourceFile(program, options.path);

        const sourceFileMap = createSourceFileMap(program, {
            ignorePathsWith: ignorePathsMap,
            pathResolutionMap: pathResolutionMap,
            duplicatePathPrecedenceMap: duplicatePrecedenceMap,
            debug: false
        });

        const importsMap = createImportsMap(sourceFile, {
            debug: true,
            nodeParseFn: parseDefinition as any,
            pathResolutionMap: pathResolutionMap,
            importsMapElementCreatorFn: (importName: string, importModule: string) => {

                const sourceModule = sourceFileMap.get(importModule, importName);

                let result: ImportsMapElementExtended<[kind?: ts.SyntaxKind]> = [importName, importModule];

                if(!sourceModule) {
                    console.log(`No source module found for ${importName}`);
                }

                if (sourceModule) {
                    result = [importName, sourceModule[0], sourceModule[1]];
                }

                return convertPath(result, pathConversionMap);
            }
        });

        const localMap = createLocalMap(program, sourceFile);

        const parsedSF = parseSourceFile(program, sourceFile, {
            returnArray: false,
            lazy: false,
            debug: false,
            nodeParseFn: parseDefinition
        });

        const info = parse(options.path);

        const outputPath = normalize(await getOutputPath(info.dir, tree)),
          outputName = info.name,
          classDec = getClassDeclaration(parsedSF),
          type = info.name.split('.').pop() || '',
          name = classDec.name || 'No name found',
          isUI = isUIType(classDec);

        let uiDef: ReturnType<typeof getUIDefinition> | undefined = undefined,
          controls: any[] = [];

        if(isUI) {
            uiDef = getUIDefinition(classDec);
            controls = createControls(uiDef.inpts, importsMap, localMap);
        }

        const def = {
            ...getClassDefinition(classDec),
            ...(uiDef || {}),
            controls,
        }

        processDefinition(def, importsMap);

        const templateSource = apply(url('./files/file'), [
            applyTemplates({
                classify: strings.classify,
                dasherize: strings.dasherize,
                capitalize: strings.capitalize,
                stringify: JSON.stringify,
                isUI,
                type,
                name: name.replace(strings.capitalize(type), ''),
                outputName,
                ...def
            }),
            move(normalize(`${outputPath}/.README/${strings.dasherize(outputName)}`))
        ]);

        return mergeWith(templateSource);
    }
}


function processDefinition<M extends ImportsMap<unknown[]>>(classDef: any, importMap: M) {

    Object.keys(classDef).forEach(key => {
        if(!['extendss', 'implements', 'inputs', 'outputs', 'properties', 'methods'].includes(key)) {
            return;
        }
        if(typeof classDef[key] === 'string') {
            classDef[key] = processString(classDef[key], importMap);
        }

        if(Array.isArray(classDef[key])) {
            classDef[key] = classDef[key].map((item: any) => {
                if(typeof item === 'string') {
                    return processString(item, importMap);
                }

                return item;
            });
        }
    });
}


function processString<M extends ImportsMap<unknown[]>>(str: string, importMap: M): string {

    str = escapeHtml(str);

    importMap.forEach((imports) => {
        const [importName, importModule] = imports;
        const matcher = new RegExp(`\\b(${importName})\\b`, 'g');

        if(str.search(matcher) !== -1) {
            str = str.replace(matcher, `<a href="${importModule}">$1</a>`);
        }
    });

    return str;
}

function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
}

async function getWorkspace(tree: Tree): Promise<WorkspaceDefinition | undefined> {

    let ws: WorkspaceDefinition | undefined = undefined;

    try {
        ws = await getWS(tree);
    } catch(e) {
        throw Error(`${e.message}\nThis can be caused when using the global 'schematics' command instead of 'ng generate`);
    }

    return ws;
}

async function getOutputPath(path: string, tree: Tree): Promise<string> {

    const ws = await getWorkspace(tree);

    ws?.projects.forEach(project => {
        if(process.cwd().includes(project.root)) {
            path = `${relative(process.cwd(), project.root)}/${path}`;
        }
    });

    return path;
}

function getClassDeclaration(parsedSF: any): ClassDec {
    return parsedSF.filter((node: any) => node.kind === 'class')[0];
}


function getClassDefinition(classDec: ClassDec) {

    // need to get list of dependencies
    // need a non ng version of getPublicProperties

    return {
        implements: getHeritageClausesByType(
          'implements',
          getChildByKind<HeritageClause>(classDec, DefinitionTypes.HERITAGE)
        ).flat().join(', '),
        extendss: getHeritageClausesByType(
          'extends', getChildByKind<HeritageClause>(classDec, DefinitionTypes.HERITAGE)
        ).flat().join(', '),
        properties: getPublicProperties(
          getChildByKind<PropertyDeclaration>(classDec, DefinitionTypes.PROPERTY)
        ),
        methods: getPublicMethodSignatures(
          getChildByKind<Method>(classDec, DefinitionTypes.METHOD)
        ),
        //getAccessors = classDec.setter,
        //setAccessors = classDec.getter
    }
}

function isUIType(classDec: ClassDec): boolean {

    const decorator = getChildByKind<DecoratorDef<any, any>>(classDec, DefinitionTypes.DECORATOR)[0];

    if (!decorator || !uiTypes.includes(decorator.type.toLowerCase())) {
        console.log(`No angular ui decorator found in ${classDec.name}`);
        return false;
    }

    return true
}

function getUIDefinition(classDec: ClassDec) {

    // need an ng version of getPublicMethodSignatures that removes the ng interface methods

    const name = classDec.name || 'No name found',
      decorator = getChildByKind<DecoratorDef<any, any>>(classDec, DefinitionTypes.DECORATOR)[0];

    const type = decorator.type,
      metadata: DirectiveMetaData | ComponentMetaData = decorator.metadata as DirectiveMetaData | ComponentMetaData,
      inpts = getInputs(getChildByKind<PropertyDeclaration>(classDec, DefinitionTypes.PROPERTY)),
      inputs = inpts.map(prop => prop.signature);

    return {
        type,
        name: name.replace(type, ''),
        selector: metadata.selector,
        standalone: metadata.standalone,
        inputs,
        inpts,
        outputs: getOutputs(
          getChildByKind<PropertyDeclaration>(classDec, DefinitionTypes.PROPERTY)
        ),
    }
}


function getChildByKind<R>(declaration: any, kind: DefinitionTypes): R[] {
    return declaration.children.filter((node: any): node is R => node.kind === kind);
}


function createProgram(entryPoint: string, options: ts.CompilerOptions): ts.Program {
    return ts.createProgram([entryPoint], options);
}

function getSourceFile(program: ts.Program, sourcePath: string): ts.SourceFile {

    const sourceFile = program.getSourceFile(sourcePath);

    if(!sourceFile) {
        throw new Error(`No source file found for ${sourcePath} - if it\'s part of a library make sure it\'s exported in the public-api.ts file`);
    }

    return sourceFile;
}
