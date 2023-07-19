"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = void 0;
const schematics_1 = require("@angular-devkit/schematics");
const path_1 = require("path");
const core_1 = require("@angular-devkit/core");
function getExampleHtml(tree, dirPath) {
    const exampleHtmlPath = (0, core_1.normalize)(`${dirPath}/EXAMPLE.html`);
    if (!tree.exists(exampleHtmlPath)) {
        throw new schematics_1.FileDoesNotExistException(exampleHtmlPath);
    }
    const buffer = tree.read(exampleHtmlPath);
    return buffer === null || buffer === void 0 ? void 0 : buffer.toString();
}
function getExampleCss(tree, dirPath) {
    const exampleCssPath = (0, core_1.normalize)(`${dirPath}/EXAMPLE.scss`);
    if (!tree.exists(exampleCssPath)) {
        console.warn(`File: ${exampleCssPath} not found.`);
    }
    const buffer = tree.read(exampleCssPath);
    return buffer === null || buffer === void 0 ? void 0 : buffer.toString();
}
function createDynamicModuleMap(tree, path) {
    const map = [];
    tree.getDir(path).subdirs.forEach((dirName) => {
        const filePath = `${dirName}/${dirName}-example.component`;
        if (!tree.exists((0, core_1.normalize)(`${path}/${filePath}.ts`))) {
            return;
        }
        map.push([dirName, `./${(0, core_1.normalize)(filePath)}`]);
    });
    return map;
}
function test(options) {
    console.log(options);
    return (tree, _context) => {
        if (!tree.exists(options.componentFilePath)) {
            throw new schematics_1.FileDoesNotExistException(options.componentFilePath);
        }
        const dirPath = (0, core_1.normalize)(`${(0, path_1.dirname)(options.componentFilePath)}/.README/`), outputName = (0, path_1.basename)(options.componentFilePath).split('.')[0], html = getExampleHtml(tree, dirPath), css = getExampleCss(tree, dirPath), rules = [];
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files/component'), [
            (0, schematics_1.applyTemplates)({
                classify: core_1.strings.classify,
                dasherize: core_1.strings.dasherize,
                name: outputName,
                html: html,
                css: css ? true : false
            }),
            (0, schematics_1.move)((0, core_1.normalize)(`${options.outputPath}/${outputName}/`))
        ]);
        rules.push((0, schematics_1.mergeWith)(templateSource));
        if (css) {
            const cssSource = (0, schematics_1.apply)((0, schematics_1.url)('./files/styles'), [
                (0, schematics_1.applyTemplates)({
                    dasherize: core_1.strings.dasherize,
                    name: outputName,
                    css: css
                }),
                (0, schematics_1.move)((0, core_1.normalize)(`${options.outputPath}/${outputName}/`))
            ]);
            rules.push((0, schematics_1.mergeWith)(cssSource));
        }
        const moduleSource = (0, schematics_1.apply)((0, schematics_1.url)('./files/module'), [
            (0, schematics_1.applyTemplates)({
                entries: createDynamicModuleMap(tree, options.outputPath),
                classify: core_1.strings.classify
            }),
            (0, schematics_1.move)((0, core_1.normalize)(options.outputPath))
        ]);
        rules.push((0, schematics_1.mergeWith)(moduleSource, schematics_1.MergeStrategy.Overwrite));
        return (0, schematics_1.chain)(rules);
    };
}
exports.test = test;
//# sourceMappingURL=index.js.map