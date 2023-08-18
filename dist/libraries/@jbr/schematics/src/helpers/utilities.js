"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodesOfKind = exports.getAllNodesFromSource = exports.getExportedDeclarationsFromSource = exports.parseSourceFile = exports.walkTree = exports.isParsedResult = exports.getClassDeclarationFromFile = void 0;
const ts = require("typescript");
const class_1 = require("./definitions/class");
const symbol_helper_1 = require("./symbol-helper");
function getClassDeclarationFromFile(file) {
    const program = ts.createProgram([file], { allowJs: true, emitDecoratorMetadata: false, experimentalDecorators: true }), sourceFile = program.getSourceFile(file);
    if (!sourceFile) {
        throw new Error(`No source file found for ${file}`);
    }
    return (0, class_1.getClassDeclaration)(sourceFile);
}
exports.getClassDeclarationFromFile = getClassDeclarationFromFile;
function isParsedResult(result) {
    return typeof result === 'object' && 'result' in result && 'exit' in result;
}
exports.isParsedResult = isParsedResult;
function walkTree(node, sourceFile, options) {
    const parseFn = (options === null || options === void 0 ? void 0 : options.nodeParseFn) || ((node) => node), children = [];
    let parsed, exit = false;
    if (options === null || options === void 0 ? void 0 : options.lazy) {
        parsed = (() => {
            let parsedNode;
            return () => {
                if (!parsedNode) {
                    const res = parseFn(node, sourceFile, options === null || options === void 0 ? void 0 : options.debug);
                    parsedNode = isParsedResult(res) ? res.result : res;
                }
                return parsedNode;
            };
        })();
    }
    else {
        const res = parseFn(node, sourceFile, options === null || options === void 0 ? void 0 : options.debug);
        if (isParsedResult(res)) {
            parsed = res.result;
            exit = res.exit;
        }
        else {
            parsed = res;
        }
    }
    if (!exit && node.getChildCount(sourceFile) >= 0) {
        node.forEachChild(childNode => {
            children.push(walkTree(childNode, sourceFile, options));
        });
    }
    if (options === null || options === void 0 ? void 0 : options.returnArray) {
        return children.length ? [parsed, children] : [parsed];
    }
    if (children.length) {
        parsed['children'] = children;
    }
    return parsed;
}
exports.walkTree = walkTree;
function parseSourceFile(program, sourceFile, options) {
    const results = getExportedDeclarationsFromSource(program, sourceFile)
        .map(declaration => walkTree(declaration, sourceFile, options));
    if (options === null || options === void 0 ? void 0 : options.debug) {
        logResults(results);
    }
    return results;
}
exports.parseSourceFile = parseSourceFile;
function getExportedDeclarationsFromSource(program, sourceFile) {
    const symbol = (0, symbol_helper_1.convertSourceFileToSymbol)(program, sourceFile), typeChecker = program.getTypeChecker();
    if (!symbol) {
        return [];
    }
    return typeChecker.getExportsOfModule(symbol)
        .map(value => { var _a; return (_a = value.declarations) === null || _a === void 0 ? void 0 : _a[0]; })
        .filter((declaration) => !!declaration);
}
exports.getExportedDeclarationsFromSource = getExportedDeclarationsFromSource;
function logResults(results) {
    results.forEach(result => console.log(JSON.stringify(Array.isArray(result) ? { result } : result, null, 2)));
}
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
//# sourceMappingURL=utilities.js.map