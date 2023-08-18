"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tscTest = exports.allTypes = exports.nonUiTypes = exports.uiTypes = void 0;
const ts = require("typescript");
const schematics_1 = require("@angular-devkit/schematics");
const utilities_1 = require("../helpers/utilities");
const definition_types_1 = require("../helpers/definitions/definition-types");
const ts_config_parser_1 = require("../helpers/ts-config-parser");
const path_1 = require("path");
const heritage_1 = require("../helpers/definitions/heritage");
const ng_helpers_1 = require("../helpers/ng/ng-helpers");
const method_1 = require("../helpers/definitions/method");
const core_1 = require("@angular-devkit/core");
const workspace_1 = require("@schematics/angular/utility/workspace");
const source_file_map_factory_1 = require("../helpers/source-files/source-file-map-factory");
const imports_path_convertor_1 = require("../helpers/imports/imports-path-convertor");
const imports_map_factory_1 = require("../helpers/imports/imports-map-factory");
const local_map_1 = require("../helpers/local/local-map");
const create_controls_1 = require("../helpers/controls/create-controls");
exports.uiTypes = ['component', 'directive', 'pipe'];
exports.nonUiTypes = ['service', 'module', 'class', 'interface', 'enum', 'guard', 'resolver', 'abstract'];
exports.allTypes = [...exports.uiTypes, ...exports.nonUiTypes];
const ignorePathsMap = [
    'tslib',
    'public-api',
    /^(?!.*@angular).*?\/index((\.d)*?\.ts)*?$/g,
    '@juggle/resize-observer/lib/exports',
    'rxjs/dist/types/internal/types',
];
const pathResolutionMap = [
    [/^.*?\/node_modules\/(.*?)(?:\/index)?$/g, '$1'],
    [/^.*?\/jbr\/(?:dist\/)?libraries\/(?:@jbr\/)?(.*?)$/g, '@jbr/$1'],
];
const duplicatePrecedenceMap = [
    ['rxjs/dist/types/internal/operators', 0],
    ['rxjs/dist/types/internal/observable', 1],
];
const rxjsTypeMap = {
    [ts.SyntaxKind.ClassDeclaration]: 'class',
    [ts.SyntaxKind.FunctionDeclaration]: 'function',
    [ts.SyntaxKind.TypeAliasDeclaration]: 'type-alias',
    [ts.SyntaxKind.InterfaceDeclaration]: 'interface',
    [ts.SyntaxKind.VariableDeclaration]: 'const'
};
const rxjsPathReplaceFn = (_importName, _importModule, kind) => {
    return `https://rxjs.dev/api/index/${rxjsTypeMap[kind || ''] || ''}/`;
};
const pathConversionMap = [
    [/^rxjs(.*[\\\/])/g, rxjsPathReplaceFn],
    [/^@angular\/(.*?)$/g, 'https://angular.io/api/$1/$importName'],
    [/^@jbr\/([^\/]*)(?:\/src)?\/lib/g, 'libraries/$1'],
];
function tscTest(options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        const config = (0, ts_config_parser_1.getParsedConfig)();
        const program = createProgram(config.fileNames[0], config.options), sourceFile = getSourceFile(program, options.path);
        const sourceFileMap = (0, source_file_map_factory_1.createSourceFileMap)(program, {
            ignorePathsWith: ignorePathsMap,
            pathResolutionMap: pathResolutionMap,
            duplicatePathPrecedenceMap: duplicatePrecedenceMap,
            debug: false
        });
        const importsMap = (0, imports_map_factory_1.createImportsMap)(sourceFile, {
            debug: true,
            nodeParseFn: definition_types_1.parseDefinition,
            pathResolutionMap: pathResolutionMap,
            importsMapElementCreatorFn: (importName, importModule) => {
                const sourceModule = sourceFileMap.get(importModule, importName);
                let result = [importName, importModule];
                if (!sourceModule) {
                    console.log(`No source module found for ${importName}`);
                }
                if (sourceModule) {
                    result = [importName, sourceModule[0], sourceModule[1]];
                }
                return (0, imports_path_convertor_1.convertPath)(result, pathConversionMap);
            }
        });
        const localMap = (0, local_map_1.createLocalMap)(program, sourceFile);
        const parsedSF = (0, utilities_1.parseSourceFile)(program, sourceFile, {
            returnArray: false,
            lazy: false,
            debug: false,
            nodeParseFn: definition_types_1.parseDefinition
        });
        const info = (0, path_1.parse)(options.path);
        const outputPath = (0, core_1.normalize)(yield getOutputPath(info.dir, tree)), outputName = info.name, classDec = getClassDeclaration(parsedSF), type = info.name.split('.').pop() || '', name = classDec.name || 'No name found', isUI = isUIType(classDec);
        let uiDef = undefined, controls = [];
        if (isUI) {
            uiDef = getUIDefinition(classDec);
            controls = (0, create_controls_1.createControls)(uiDef.inpts, importsMap, localMap);
        }
        const def = Object.assign(Object.assign(Object.assign({}, getClassDefinition(classDec)), (uiDef || {})), { controls });
        processDefinition(def, importsMap);
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files/file'), [
            (0, schematics_1.applyTemplates)(Object.assign({ classify: core_1.strings.classify, dasherize: core_1.strings.dasherize, capitalize: core_1.strings.capitalize, stringify: JSON.stringify, isUI,
                type, name: name.replace(core_1.strings.capitalize(type), ''), outputName }, def)),
            (0, schematics_1.move)((0, core_1.normalize)(`${outputPath}/.README/${core_1.strings.dasherize(outputName)}`))
        ]);
        return (0, schematics_1.mergeWith)(templateSource);
    });
}
exports.tscTest = tscTest;
function processDefinition(classDef, importMap) {
    Object.keys(classDef).forEach(key => {
        if (!['extendss', 'implements', 'inputs', 'outputs', 'properties', 'methods'].includes(key)) {
            return;
        }
        if (typeof classDef[key] === 'string') {
            classDef[key] = processString(classDef[key], importMap);
        }
        if (Array.isArray(classDef[key])) {
            classDef[key] = classDef[key].map((item) => {
                if (typeof item === 'string') {
                    return processString(item, importMap);
                }
                return item;
            });
        }
    });
}
function processString(str, importMap) {
    str = escapeHtml(str);
    importMap.forEach((imports) => {
        const [importName, importModule] = imports;
        const matcher = new RegExp(`\\b(${importName})\\b`, 'g');
        if (str.search(matcher) !== -1) {
            str = str.replace(matcher, `<a href="${importModule}">$1</a>`);
        }
    });
    return str;
}
function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
function getWorkspace(tree) {
    return __awaiter(this, void 0, void 0, function* () {
        let ws = undefined;
        try {
            ws = yield (0, workspace_1.getWorkspace)(tree);
        }
        catch (e) {
            throw Error(`${e.message}\nThis can be caused when using the global 'schematics' command instead of 'ng generate`);
        }
        return ws;
    });
}
function getOutputPath(path, tree) {
    return __awaiter(this, void 0, void 0, function* () {
        const ws = yield getWorkspace(tree);
        ws === null || ws === void 0 ? void 0 : ws.projects.forEach(project => {
            if (process.cwd().includes(project.root)) {
                path = `${(0, path_1.relative)(process.cwd(), project.root)}/${path}`;
            }
        });
        return path;
    });
}
function getClassDeclaration(parsedSF) {
    return parsedSF.filter((node) => node.kind === 'class')[0];
}
function getClassDefinition(classDec) {
    // need to get list of dependencies
    // need a non ng version of getPublicProperties
    return {
        implements: (0, heritage_1.getHeritageClausesByType)('implements', getChildByKind(classDec, definition_types_1.DefinitionTypes.HERITAGE)).flat().join(', '),
        extendss: (0, heritage_1.getHeritageClausesByType)('extends', getChildByKind(classDec, definition_types_1.DefinitionTypes.HERITAGE)).flat().join(', '),
        properties: (0, ng_helpers_1.getPublicProperties)(getChildByKind(classDec, definition_types_1.DefinitionTypes.PROPERTY)),
        methods: (0, method_1.getPublicMethodSignatures)(getChildByKind(classDec, definition_types_1.DefinitionTypes.METHOD)),
        //getAccessors = classDec.setter,
        //setAccessors = classDec.getter
    };
}
function isUIType(classDec) {
    const decorator = getChildByKind(classDec, definition_types_1.DefinitionTypes.DECORATOR)[0];
    if (!decorator || !exports.uiTypes.includes(decorator.type.toLowerCase())) {
        console.log(`No angular ui decorator found in ${classDec.name}`);
        return false;
    }
    return true;
}
function getUIDefinition(classDec) {
    // need an ng version of getPublicMethodSignatures that removes the ng interface methods
    const name = classDec.name || 'No name found', decorator = getChildByKind(classDec, definition_types_1.DefinitionTypes.DECORATOR)[0];
    const type = decorator.type, metadata = decorator.metadata, inpts = (0, ng_helpers_1.getInputs)(getChildByKind(classDec, definition_types_1.DefinitionTypes.PROPERTY)), inputs = inpts.map(prop => prop.signature);
    return {
        type,
        name: name.replace(type, ''),
        selector: metadata.selector,
        standalone: metadata.standalone,
        inputs,
        inpts,
        outputs: (0, ng_helpers_1.getOutputs)(getChildByKind(classDec, definition_types_1.DefinitionTypes.PROPERTY)),
    };
}
function getChildByKind(declaration, kind) {
    return declaration.children.filter((node) => node.kind === kind);
}
function createProgram(entryPoint, options) {
    return ts.createProgram([entryPoint], options);
}
function getSourceFile(program, sourcePath) {
    const sourceFile = program.getSourceFile(sourcePath);
    if (!sourceFile) {
        throw new Error(`No source file found for ${sourcePath} - if it\'s part of a library make sure it\'s exported in the public-api.ts file`);
    }
    return sourceFile;
}
//# sourceMappingURL=index.js.map