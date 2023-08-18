"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSourceFileMap = void 0;
const utils_1 = require("../utils");
const source_file_map_1 = require("./source-file-map");
const symbol_helper_1 = require("../symbol-helper");
function createSourceFileMap(program, options) {
    const sourceFilesMap = new source_file_map_1.SourceFileMap(options);
    program.getSourceFiles()
        .filter(sourceFile => isSourceFileEligible(program, sourceFile, options))
        .map(sourceFile => [sourceFile, getSymbolFromSource(program, sourceFile)])
        .filter((arg) => !!arg[1])
        .forEach(([sourceFile, symbol]) => {
        symbol.exports.forEach((value, key) => {
            var _a;
            if (['__export', '__exportStar'].includes(value.name) || value.name.includes('ɵ')) {
                return;
            }
            const declaration = (_a = value.declarations) === null || _a === void 0 ? void 0 : _a[0];
            if (!declaration) {
                return;
            }
            let extras;
            if (options && 'sourceModuleCreatorFn' in options) {
                extras = options.sourceModuleCreatorFn(declaration, sourceFile, options.debug);
            }
            sourceFilesMap.set(symbol.name, key.toString(), declaration.kind, ...(extras || []));
        });
    });
    if (options === null || options === void 0 ? void 0 : options.debug) {
        (0, utils_1.log)(sourceFilesMap.toString(), 'SOURCE FILES MAP');
    }
    return sourceFilesMap;
}
exports.createSourceFileMap = createSourceFileMap;
function isSourceFileEligible(program, sourceFile, options) {
    const baseUrl = program.getCompilerOptions().baseUrl || '';
    if (!baseUrl && (options === null || options === void 0 ? void 0 : options.debug)) {
        console.warn('No baseUrl found in tsconfig.json');
    }
    if (!sourceFile.fileName.includes(baseUrl)) {
        return false;
    }
    return !ignorePath(sourceFile.fileName, (options === null || options === void 0 ? void 0 : options.ignorePathsWith) || [], options === null || options === void 0 ? void 0 : options.debug);
}
function getSymbolFromSource(program, sourceFile) {
    const symbol = (0, symbol_helper_1.convertSourceFileToSymbol)(program, sourceFile);
    if (isSymbolWithExports(symbol)) {
        return symbol;
    }
    return undefined;
}
function isSymbolWithExports(symbol) {
    var _a;
    return !!((_a = symbol === null || symbol === void 0 ? void 0 : symbol.exports) === null || _a === void 0 ? void 0 : _a.size);
}
function ignorePath(path, map, debug = false) {
    const ignore = map.some(value => {
        return path.search(value) !== -1;
    });
    if (ignore && debug) {
        (0, utils_1.log)(path, 'IGNORING PATH');
    }
    return ignore;
}
//# sourceMappingURL=source-file-map-factory.js.map