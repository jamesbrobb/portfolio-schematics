"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const core_1 = require("@angular-devkit/core");
const utilities_1 = require("../helpers/utilities");
const class_1 = require("../helpers/definitions/class");
const ng_helpers_1 = require("../helpers/ng/ng-helpers");
const method_1 = require("../helpers/definitions/method");
function default_1(options) {
    return (tree, _context) => {
        const rules = [];
        if (!tree.exists(options.componentFilePath)) {
            throw new schematics_1.FileDoesNotExistException(options.componentFilePath);
        }
        const path = options.componentFilePath.split('/').slice(0, -1).join('/'), classDec = (0, utilities_1.getClassDeclarationFromFile)(options.componentFilePath), heritageClauses = classDec[class_1.DefinitionType.HeritageClause], decorator = classDec[class_1.DefinitionType.Decorator], properties = classDec[class_1.DefinitionType.PropertyDeclaration], methods = classDec[class_1.DefinitionType.MethodDeclaration];
        //getAccessors = classDec[DefinitionType.GetAccessor],
        //setAccessors = classDec[DefinitionType.SetAccessor];
        //console.log(classDec);
        if (!decorator) {
            throw new Error(`No @Component decorator found in ${options.componentFilePath}`);
        }
        const metadata = decorator.metadata;
        const templateSource = (0, schematics_1.apply)((0, schematics_1.url)('./files'), [
            (0, schematics_1.applyTemplates)({
                classify: core_1.strings.classify,
                dasherize: core_1.strings.dasherize,
                name: classDec[class_1.DefinitionType.Identifier] || 'Component',
                selector: metadata.selector,
                standalone: metadata.standalone,
                inputs: (0, ng_helpers_1.getInputs)(properties),
                outputs: (0, ng_helpers_1.getOutputs)(properties),
                properties: (0, ng_helpers_1.getPublicProperties)(properties),
                methods: (0, method_1.getPublicMethodSignatures)(methods),
                implements: heritageClauses.filter(clause => clause.keyword === 'implements').map(clause => clause.types),
                extendss: heritageClauses.filter(clause => clause.keyword === 'extends').map(clause => clause.types),
            }),
            (0, schematics_1.move)((0, core_1.normalize)(`${path}/.README`))
        ]);
        rules.push((0, schematics_1.mergeWith)(templateSource, schematics_1.MergeStrategy.Overwrite));
        return (0, schematics_1.chain)(rules);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map