"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.resolveDuplicatePath = exports.resolvePath = exports.getChildByKind = exports.getText = exports.ignoreChildren = void 0;
const ts = require("typescript");
function ignoreChildren(func) {
    return (...args) => {
        const result = func.apply(undefined, args);
        return {
            exit: true,
            result
        };
    };
}
exports.ignoreChildren = ignoreChildren;
function getText(node, sourceFile) {
    return ts.isStringLiteral(node) ? node.text : node.getText(sourceFile);
}
exports.getText = getText;
function getChildByKind(declaration, kind) {
    return declaration.children.filter((node) => node.kind === kind);
}
exports.getChildByKind = getChildByKind;
function resolvePath(path, map) {
    path = path.replace(/"/g, '').replace(/'/g, '');
    map.forEach((value) => {
        if (path.search(value[0]) === -1) {
            return;
        }
        if (value[0] instanceof RegExp && value[0].test(path)) {
            path = path.replace(value[0], value[1] || '');
        }
        if (typeof value[0] === 'string') {
            path = `${value[1] || ''}${path.split(value[0]).slice(-1)[0]}${value[2] || ''}`;
        }
    });
    return path.replace(/^\//, '');
}
exports.resolvePath = resolvePath;
function resolveDuplicatePath(existingPath, newPath, map) {
    let result = 0;
    const a = map.find((value) => {
        return existingPath.search(value[0]) !== -1;
    });
    const b = map.find((value) => {
        return newPath.search(value[0]) !== -1;
    });
    if (a && b) {
        result = Math.min(Math.max(a[1] - b[1], 1), -1);
    }
    return result;
}
exports.resolveDuplicatePath = resolveDuplicatePath;
function log(message, header) {
    console.log(`-----------${header || '-----------'}-----------`);
    console.log(message);
    console.log('----------------------------------');
}
exports.log = log;
//# sourceMappingURL=utils.js.map