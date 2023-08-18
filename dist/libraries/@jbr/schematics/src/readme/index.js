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
exports.createReadme = void 0;
const fs = require("fs");
const path_1 = require("path");
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const workspace_1 = require("@schematics/angular/utility/workspace");
const schema_1 = require("./schema");
const utilities_1 = require("../helpers/utilities");
const ng_helpers_1 = require("../helpers/ng/ng-helpers");
const method_1 = require("../helpers/definitions/method");
const heritage_1 = require("../helpers/definitions/heritage");
function createReadme(options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        yield getWorkspace(tree);
        if (!options.path && !options.dir) {
            throw new Error('You must specify a file path or directory path.');
        }
        const templateSource = options.path ? yield handleFile(tree, options.path, options.type) : handleDir(tree, options.dir);
        return (0, schematics_1.mergeWith)(templateSource);
    });
}
exports.createReadme = createReadme;
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
function handleFile(tree, path, type) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs.existsSync(path)) {
            throw new Error(`File: ${path} does not exist.`);
        }
        const info = (0, path_1.parse)(path);
        type = (type || info.name.split('.').pop());
        if (!type) {
            throw new Error(`No type option provided and no file type found in ${info.name}`);
        }
        if (!schema_1.allTypes.includes(type)) {
            throw new Error(`Invalid type option: ${type}. Valid options are: ${schema_1.allTypes.join(' | ')}`);
        }
        const isUI = schema_1.uiTypes.includes(type), outputPath = yield getOutputPath(info.dir, tree), outputName = info.name, classDec = (0, utilities_1.getClassDeclarationFromFile)(path), name = classDec.name || 'No name found';
        let def = getClassDefinition(classDec);
        if (isUI) {
            def = Object.assign(Object.assign({}, def), getUIDefinition(classDec));
        }
        return (0, schematics_1.apply)((0, schematics_1.url)('./files/file'), [
            (0, schematics_1.applyTemplates)(Object.assign({ classify: core_1.strings.classify, dasherize: core_1.strings.dasherize, isUI,
                type, name: name.replace((0, strings_1.capitalize)(type), ''), outputName }, def)),
            (0, schematics_1.move)((0, core_1.normalize)(`${outputPath}/.README/${(0, strings_1.dasherize)(outputName)}`))
        ]);
    });
}
function getOutputPath(path, tree) {
    return __awaiter(this, void 0, void 0, function* () {
        const ws = yield getWorkspace(tree);
        ws === null || ws === void 0 ? void 0 : ws.projects.forEach(project => {
            if (process.cwd().includes(project.root)) {
                path = (0, core_1.normalize)(`${(0, path_1.relative)(process.cwd(), project.root)}/${path}`);
            }
        });
        return path;
    });
}
function handleDir(tree, dirPath) {
    if (!fs.existsSync(dirPath)) {
        throw new Error(`Directory: ${dirPath} does not exist.`);
    }
    const info = (0, path_1.parse)(dirPath), entitiesPath = `${dirPath}/.README`;
    let entities = [];
    if (fs.existsSync(entitiesPath)) {
        entities = tree.getDir(entitiesPath).subdirs;
    }
    return (0, schematics_1.apply)((0, schematics_1.url)('./files/directory'), [
        (0, schematics_1.applyTemplates)({
            classify: core_1.strings.classify,
            dasherize: core_1.strings.dasherize,
            name: info.name,
            entities
        }),
        (0, schematics_1.move)((0, core_1.normalize)(`${dirPath}/.README`))
    ]);
}
function getClassDefinition(classDec) {
    // need to get list of dependencies
    // need a non ng version of getPublicProperties
    return {
        implements: (0, heritage_1.getHeritageClausesByType)('implements', classDec.heritage),
        extendss: (0, heritage_1.getHeritageClausesByType)('extends', classDec.heritage),
        properties: (0, ng_helpers_1.getPublicProperties)(classDec.property),
        methods: (0, method_1.getPublicMethodSignatures)(classDec.method),
        //getAccessors = classDec.setter,
        //setAccessors = classDec.getter
    };
}
function getUIDefinition(classDec) {
    // need an ng version of getPublicMethodSignatures that removes the ng interface methods
    const name = classDec.name || 'No name found', decorator = classDec.decorator;
    if (!decorator) {
        throw new Error(`No @Component decorator found in ${name}`);
    }
    const type = decorator.type, metadata = decorator.metadata;
    return {
        type,
        name: name.replace(type, ''),
        selector: metadata.selector,
        standalone: metadata.standalone,
        inputs: (0, ng_helpers_1.getInputs)(classDec.property),
        outputs: (0, ng_helpers_1.getOutputs)(classDec.property),
    };
}
//# sourceMappingURL=index.js.map