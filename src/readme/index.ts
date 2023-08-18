import * as fs from "fs";
import {parse, relative} from "path";

import {
    apply,
    applyTemplates,
    mergeWith,
    move,
    Rule,
    SchematicContext, Source,
    Tree,
    url
} from "@angular-devkit/schematics";

import {normalize, strings} from "@angular-devkit/core";
import {capitalize, dasherize} from "@angular-devkit/core/src/utils/strings";
import {getWorkspace as getWS} from "@schematics/angular/utility/workspace";
import {WorkspaceDefinition} from "@angular-devkit/core/src/workspace";

import {allTypes, Schema, TYPES, UI_TYPE, uiTypes} from "./schema";
import {getClassDeclarationFromFile} from "../helpers/utilities";
import {ClassDeclaration} from "../helpers/definitions/class";
import {ComponentMetaData, DirectiveMetaData} from "../helpers/ng/ng-decorators";
import {getInputs, getOutputs, getPublicProperties} from "../helpers/ng/ng-helpers";
import {getPublicMethodSignatures} from "../helpers/definitions/method";
import {getHeritageClausesByType} from "../helpers/definitions/heritage";


export function createReadme(options: Schema): Rule {
    return async (tree: Tree, _context: SchematicContext) => {

        await getWorkspace(tree);

        if(!options.path && !options.dir) {
            throw new Error('You must specify a file path or directory path.');
        }

        const templateSource = options.path ? await handleFile(tree, options.path, options.type) : handleDir(tree, options.dir);

        return mergeWith(templateSource);
    }
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


async function handleFile(tree: Tree, path: string, type: TYPES | undefined): Promise<Source> {

    if(!fs.existsSync(path)) {
        throw new Error(`File: ${path} does not exist.`);
    }

    const info = parse(path);

    type = (type || info.name.split('.').pop()) as TYPES;

    if(!type) {
        throw new Error(`No type option provided and no file type found in ${info.name}`);
    }

    if(!allTypes.includes(type)) {
        throw new Error(`Invalid type option: ${type}. Valid options are: ${allTypes.join(' | ')}`);
    }

    const isUI = uiTypes.includes(type as UI_TYPE),
      outputPath = await getOutputPath(info.dir, tree),
      outputName = info.name,
      classDec = getClassDeclarationFromFile(path),
      name = classDec.name || 'No name found';

    let def = getClassDefinition(classDec);

    if(isUI) {
        def = {
            ...def,
            ...getUIDefinition(classDec)
        }
    }

    return apply(url('./files/file'), [
        applyTemplates({
            classify: strings.classify,
            dasherize: strings.dasherize,
            isUI,
            type,
            name: name.replace(capitalize(type), ''),
            outputName,
            ...def
        }),
        move(normalize(`${outputPath}/.README/${dasherize(outputName)}`))
    ]);
}

async function getOutputPath(path: string, tree: Tree): Promise<string> {

    const ws = await getWorkspace(tree);

    ws?.projects.forEach(project => {
        if(process.cwd().includes(project.root)) {
            path = normalize(`${relative(process.cwd(), project.root)}/${path}`);
        }
    });

    return path;
}


function handleDir(tree: Tree, dirPath: string): Source {

    if(!fs.existsSync(dirPath)) {
        throw new Error(`Directory: ${dirPath} does not exist.`);
    }

    const info = parse(dirPath),
      entitiesPath = `${dirPath}/.README`;

    let entities: string[] = [];

    if(fs.existsSync(entitiesPath)) {
        entities = tree.getDir(entitiesPath).subdirs;
    }

    return apply(url('./files/directory'), [
        applyTemplates({
            classify: strings.classify,
            dasherize: strings.dasherize,
            name: info.name,
            entities
        }),
        move(normalize(`${dirPath}/.README`))
    ]);
}

function getClassDefinition(classDec: ClassDeclaration) {

    // need to get list of dependencies
    // need a non ng version of getPublicProperties

    return {
        implements: getHeritageClausesByType('implements', classDec.heritage),
        extendss: getHeritageClausesByType('extends', classDec.heritage),
        properties: getPublicProperties(classDec.property),
        methods: getPublicMethodSignatures(classDec.method),
        //getAccessors = classDec.setter,
        //setAccessors = classDec.getter
    }
}

function getUIDefinition(classDec: ClassDeclaration) {

    // need an ng version of getPublicMethodSignatures that removes the ng interface methods

    const name = classDec.name || 'No name found',
      decorator = classDec.decorator;

    if (!decorator) {
        throw new Error(`No @Component decorator found in ${name}`);
    }

    const type = decorator.type,
      metadata: DirectiveMetaData | ComponentMetaData = decorator.metadata as DirectiveMetaData | ComponentMetaData;

    return {
        type,
        name: name.replace(type, ''),
        selector: metadata.selector,
        standalone: metadata.standalone,
        inputs: getInputs(classDec.property),
        outputs: getOutputs(classDec.property),
    }
}
