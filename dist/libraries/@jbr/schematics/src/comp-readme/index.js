"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const utilities_1 = require("../helpers/utilities");
const ng_helpers_1 = require("../helpers/ng/ng-helpers");
const method_1 = require("../helpers/definitions/method");
const heritage_1 = require("../helpers/definitions/heritage");
const strings_1 = require("@angular-devkit/core/src/utils/strings");
function default_1(options) {
    return (tree, _context) => {
        var _a;
        const rules = [];
        if (!tree.exists(options.componentFilePath)) {
            throw new schematics_1.FileDoesNotExistException(options.componentFilePath);
        }
        const outputPath = options.componentFilePath.split('/').slice(0, -1).join('/'), outputName = (_a = options.componentFilePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.ts', ''), classDec = (0, utilities_1.getClassDeclarationFromFile)(options.componentFilePath), heritageClauses = classDec.heritage, decorator = classDec.decorator, properties = classDec.property, methods = classDec.method;
        //getAccessors = classDec.getter,
        //setAccessors = classDec.setter;
        if (!decorator) {
            throw new Error(`No @Component decorator found in ${options.componentFilePath}`);
        }
        const type = decorator.type, name = classDec.name || 'No name found', metadata = decorator.metadata;
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.applyTemplates)({
                classify: core_1.strings.classify,
                dasherize: core_1.strings.dasherize,
                type,
                name: name.replace(type, ''),
                outputName: outputName || (0, strings_1.dasherize)(name),
                selector: metadata.selector,
                standalone: metadata.standalone,
                inputs: (0, ng_helpers_1.getInputs)(properties),
                outputs: (0, ng_helpers_1.getOutputs)(properties),
                properties: (0, ng_helpers_1.getPublicProperties)(properties),
                methods: (0, method_1.getPublicMethodSignatures)(methods),
                implements: (0, heritage_1.getHeritageClausesByType)('implements', heritageClauses),
                extendss: (0, heritage_1.getHeritageClausesByType)('extends', heritageClauses),
            }),
            (0, schematics_1.move)((0, core_1.normalize)(`${outputPath}/.README`))
        ]);
        rules.push((0, schematics_1.mergeWith)(templateSource, schematics_1.MergeStrategy.Overwrite));
        return (0, schematics_1.chain)(rules);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map