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
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
const workspace_1 = require("@schematics/angular/utility/workspace");
function createReadme(options) {
    return (tree, _context) => __awaiter(this, void 0, void 0, function* () {
        if (!options.path) {
            yield getWorkspace(tree);
        }
        const path = options.path || '.', dir = tree.getDir(path), parts = path.split('/'), name = parts[parts.length - 1]
            .split('-')
            .map(word => (0, strings_1.capitalize)(word))
            .join(' ');
        dir.subfiles.forEach(file => {
            console.log(file);
        });
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.applyTemplates)({
                classify: core_1.strings.classify,
                dasherize: core_1.strings.dasherize,
                name: name
            }),
            (0, schematics_1.move)((0, core_1.normalize)(`${path}/.README`))
        ]);
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
/*function getWorkspacePath(tree: Tree): string {
    const workspaceConfig = tree.read('./angular.json');

    if (workspaceConfig) {
        const workspaceContent = workspaceConfig.toString();
        //console.log('workspaceContent::', workspaceContent);

        const workspace: WorkspaceSchema = JSON.parse(workspaceContent);
        console.log('workspace', workspace);
        console.log(workspace.defaultProject);
        console.log(workspace.projects);
        console.log(workspace);
    }

    return ''
}*/
//# sourceMappingURL=index.js.map