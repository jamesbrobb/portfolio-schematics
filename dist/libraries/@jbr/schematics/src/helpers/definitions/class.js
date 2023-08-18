"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClassDeclaration = exports.getClassDec = void 0;
const ts = require("typescript");
const utilities_1 = require("../utilities");
const definition_types_1 = require("./definition-types");
const utils_1 = require("../utils");
function getClassDec(node, sourceFile) {
    return {
        kind: 'class',
        name: node.name ? (0, utils_1.getText)(node.name, sourceFile) : 'Class name not found',
    };
}
exports.getClassDec = getClassDec;
function getClassDeclaration(sourceFile) {
    const declaration = {
        import: [],
        decorator: undefined,
        name: undefined,
        typeParameter: undefined,
        heritage: [],
        cnstructor: undefined,
        property: [],
        method: [],
        getter: [],
        setter: []
    }, classDec = (0, utilities_1.getNodesOfKind)(ts.SyntaxKind.ClassDeclaration, sourceFile)[0];
    if (!classDec) {
        throw new Error("No Class Declaration found");
    }
    classDec.getChildren(sourceFile)
        .map(node => node.kind === ts.SyntaxKind.SyntaxList ? node.getChildren(sourceFile) : node)
        .flat(1)
        .forEach(node => {
        const parseFunc = definition_types_1.definitionTypeFunctionMap[node.kind];
        if (!parseFunc) {
            console.log(`No parse function registered for ${ts.SyntaxKind[node.kind]}`);
            console.log(node.kind);
            console.log((0, utils_1.getText)(node, sourceFile));
            console.log('-------------------');
            return;
        }
        const defType = definition_types_1.definitionTypesMap[node.kind];
        if (!defType) {
            console.log(`No definition type registered for ${ts.SyntaxKind[node.kind]}`);
            return;
        }
        if (Array.isArray(declaration[defType])) {
            let res = parseFunc(node, sourceFile);
            if ((0, utilities_1.isParsedResult)(res)) {
                res = res.result;
            }
            declaration[defType].push(res);
            return;
        }
        let res = parseFunc(node, sourceFile);
        if ((0, utilities_1.isParsedResult)(res)) {
            res = res.result;
        }
        declaration[defType] = res;
    });
    return declaration;
}
exports.getClassDeclaration = getClassDeclaration;
//# sourceMappingURL=class.js.map