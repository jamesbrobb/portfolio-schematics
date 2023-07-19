"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getText = exports.getNodesOfKind = exports.getAllNodesFromSource = exports.getClassDeclarationFromFile = void 0;
const ts = require("typescript");
const class_1 = require("./definitions/class");
function getClassDeclarationFromFile(file) {
    const program = ts.createProgram([file], { allowJs: true, emitDecoratorMetadata: false, experimentalDecorators: true }), sourceFile = program.getSourceFile(file);
    if (!sourceFile) {
        throw new Error(`No source file found for ${file}`);
    }
    return (0, class_1.getClassDeclaration)(sourceFile);
}
exports.getClassDeclarationFromFile = getClassDeclarationFromFile;
function getAllNodesFromSource(sourceFile) {
    const nodes = [sourceFile];
    const result = [];
    while (nodes.length > 0) {
        const node = nodes.shift();
        if (node) {
            result.push(node);
            if (node.getChildCount(sourceFile) >= 0) {
                nodes.unshift(...node.getChildren());
            }
        }
    }
    return result;
}
exports.getAllNodesFromSource = getAllNodesFromSource;
function getNodesOfKind(kind, sourceFile, nodes, findAll = false) {
    nodes = nodes || sourceFile.getChildren();
    const matches = [];
    nodes.forEach(node => {
        if (node.kind === kind) {
            matches.push(node);
        }
        if ((findAll || !matches.length) && node.getChildCount(sourceFile) >= 0) {
            matches.push(...getNodesOfKind(kind, sourceFile, node.getChildren(sourceFile), findAll));
        }
    });
    return matches;
}
exports.getNodesOfKind = getNodesOfKind;
function getText(node, sourceFile) {
    return ts.isStringLiteral(node) ? node.text : node.getText(sourceFile);
}
exports.getText = getText;
//# sourceMappingURL=utilities.js.map