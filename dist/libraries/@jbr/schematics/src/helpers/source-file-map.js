"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePath = exports.createSourceFileMap = exports.sourceFileMapKeyRegex = void 0;
const symbol_helper_1 = require("./symbol-helper");
exports.sourceFileMapKeyRegex = /^((@.*?\/)*[^\/]*)/g;
function createSourceFileMap(program, options) {
    const baseUrl = program.getCompilerOptions().baseUrl || '';
    if (!baseUrl && (options === null || options === void 0 ? void 0 : options.debug)) {
        console.warn('No baseUrl found in tsconfig.json');
    }
    const sourceFiles = program.getSourceFiles()
        .filter(sourceFile => sourceFile.fileName.includes(baseUrl))
        .filter(sourceFile => !ignorePath(sourceFile.fileName, (options === null || options === void 0 ? void 0 : options.ignorePathsWith) || [], options === null || options === void 0 ? void 0 : options.debug));
    const sourceFilesMap = new Map();
    sourceFiles.forEach(sourceFile => {
        var _a, _b;
        const symbol = (0, symbol_helper_1.convertSourceFileToSymbol)(program, sourceFile);
        if (!symbol || !((_a = symbol.exports) === null || _a === void 0 ? void 0 : _a.size)) {
            return;
        }
        let path = resolvePath(symbol.name, (options === null || options === void 0 ? void 0 : options.pathResolveMap) || []);
        const key = ((_b = path.match(exports.sourceFileMapKeyRegex)) === null || _b === void 0 ? void 0 : _b[0]) || '';
        if (!key && (options === null || options === void 0 ? void 0 : options.debug)) {
            log(path, 'NO KEY FOUND');
            return;
        }
        const map = sourceFilesMap.get(key) || new Map();
        sourceFilesMap.set(key, map);
        symbol.exports.forEach((value, key) => {
            var _a, _b;
            if (['__export', '__exportStar'].includes(value.name) || value.name.includes('ɵ')) {
                return;
            }
            const declaration = (_a = value.declarations) === null || _a === void 0 ? void 0 : _a[0];
            if (!declaration) {
                return;
            }
            const name = key.toString(), entry = map.get(name);
            if (entry) {
                const resolution = resolveDuplicatePath(entry[0], path, (options === null || options === void 0 ? void 0 : options.duplicatePrecedenceMap) || []);
                path = resolution === 1 ? path : entry[0];
                if (resolution === 0 && (options === null || options === void 0 ? void 0 : options.debug)) {
                    log(`Name: ${name}\nStored path: ${map.get(name)}\nDuplicate path: ${path}`, 'DUPLICATE NAME FOUND');
                    return;
                }
            }
            const extras = (_b = options === null || options === void 0 ? void 0 : options.nodeResolveFn) === null || _b === void 0 ? void 0 : _b.call(options, declaration, sourceFile, options === null || options === void 0 ? void 0 : options.debug);
            map.set(name, [path, declaration.kind, ...(extras || [])]);
        });
    });
    if (options === null || options === void 0 ? void 0 : options.debug) {
        log(sourceFilesMap, 'SOURCE FILES MAP');
    }
    return sourceFilesMap;
}
exports.createSourceFileMap = createSourceFileMap;
function ignorePath(path, map, debug = false) {
    const ignore = map.some(value => {
        return path.search(value) !== -1;
    });
    if (ignore && debug) {
        log(path, 'IGNORING PATH');
    }
    return ignore;
}
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
function log(message, header) {
    console.log(`-----------${header || '-----------'}-----------`);
    console.log(message);
    console.log('----------------------------------');
}
//# sourceMappingURL=source-file-map.js.map