"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createControls = void 0;
const ts = require("typescript");
const core_1 = require("@angular-devkit/core");
const inputTypeMap = {
    'boolean': { controlType: 'input', type: 'checkbox' },
    'string': { controlType: 'input', type: 'text' },
    'number': { controlType: 'input', type: 'number' },
    'Date': { controlType: 'input', type: 'date' },
    [ts.SyntaxKind.EnumDeclaration]: { controlType: 'select', options: '$type' }
};
function createControls(inputs, importsMap, localMap) {
    return inputs.map(input => (Object.assign(Object.assign({}, getInputType(input, importsMap, localMap)), { key: getKey(input), label: core_1.strings.capitalize(core_1.strings.dasherize(input.name)).replace(/-/g, ' '), value: input.initializedValue })));
}
exports.createControls = createControls;
function getKey(input) {
    var _a;
    let key = input.name;
    (_a = input.decorators) === null || _a === void 0 ? void 0 : _a.forEach(decorator => {
        if (decorator.metadata && typeof decorator.metadata === 'string') {
            key = decorator.metadata;
        }
    });
    return key;
}
function getInputType(input, importsMap, localMap) {
    let kind = input.type || '';
    const local = localMap.get(kind);
    if (local) {
        kind = local[0];
    }
    if (!local) {
        const imprt = importsMap.find(([importName, _importModule, _kind]) => {
            return importName.includes(input.type || '');
        });
        if (imprt) {
            kind = imprt[2] || input.type || '';
        }
    }
    const type = inputTypeMap[kind];
    if (!type) {
        console.warn(`No input type found for ${input.name} of type ${kind} - returning default input type`);
        return { controlType: 'input' };
    }
    if (type.options === '$type') {
        type.options = input.type || '';
    }
    return type;
}
//# sourceMappingURL=create-controls.js.map