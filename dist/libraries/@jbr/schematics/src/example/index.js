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
exports.createExample = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
function getTargetPath(options) {
    if (options.targetPath && !options.usePwd) {
        return options.targetPath;
    }
    return options.path;
}
function getExampleHtml(tree, options) {
    const exampleHtmlPath = (0, core_1.normalize)(`/${options.examplesPath}/${options.selector}/${options.selector}-example.html`);
    if (!tree.exists(exampleHtmlPath)) {
        throw new schematics_1.FileDoesNotExistException(`No example html file found for ${options.selector}: ${exampleHtmlPath}`);
    }
    const buffer = tree.read(exampleHtmlPath);
    return buffer === null || buffer === void 0 ? void 0 : buffer.toString();
}
function createDynamicModuleMap(tree, path) {
    const map = [];
    console.log('path', path);
    tree.getDir(path).subdirs.forEach((dirName) => {
        const filePath = `${dirName}/${dirName}-example.component`;
        if (!tree.exists((0, core_1.normalize)(`${path}/${filePath}.ts`))) {
            return;
        }
        map.push([dirName, `./${(0, core_1.normalize)(filePath)}`]);
    });
    console.log(map);
    return map;
}
function createExample(options) {
    console.log('options', options);
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const html = (_a = getExampleHtml(tree, options)) === null || _a === void 0 ? void 0 : _a.trim(), path = (0, core_1.normalize)(getTargetPath(options));
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files/component'), [
            (0, schematics_1.applyTemplates)({
                classify: core_1.strings.classify,
                dasherize: core_1.strings.dasherize,
                name: options.selector,
                selector: options.selector,
                html: html
            }),
            (0, schematics_1.move)((0, core_1.normalize)(`${path}/${(options.flat ? '' : options.selector + '/')}`))
        ]);
        const moduleSource = (0, schematics_1.apply)((0, schematics_1.url)('./files/module'), [
            (0, schematics_1.applyTemplates)({
                entries: createDynamicModuleMap(tree, path),
                classify: core_1.strings.classify
            }),
            (0, schematics_1.move)((0, core_1.normalize)(path))
        ]);
        return (0, schematics_1.chain)([
            (0, schematics_1.mergeWith)(templateSource),
            (0, schematics_1.mergeWith)(moduleSource, schematics_1.MergeStrategy.Overwrite)
        ]);
    });
}
exports.createExample = createExample;
//# sourceMappingURL=index.js.map