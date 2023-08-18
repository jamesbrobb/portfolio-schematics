"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImportsMap = void 0;
const ts = require("typescript");
const path = require("path");
const utils_1 = require("../utils");
const import_1 = require("../definitions/import");
const utilities_1 = require("../utilities");
function createImportsMap(sourceFile, options) {
    // @ts-ignore
    const map = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .map(impt => (0, utilities_1.walkTree)(impt, sourceFile, options))
        .filter(import_1.isImportDeclaration)
        .flatMap(imprt => getImportNames(imprt)
        .map(name => [name, resolveModulePath(imprt.module, sourceFile, options === null || options === void 0 ? void 0 : options.pathResolutionMap)]))
        .map(([name, module]) => { var _a; return ((_a = options === null || options === void 0 ? void 0 : options.importsMapElementCreatorFn) === null || _a === void 0 ? void 0 : _a.call(options, name, module)) || [name, module]; });
    if (options === null || options === void 0 ? void 0 : options.debug) {
        console.log(map);
    }
    return map;
}
exports.createImportsMap = createImportsMap;
function resolveModulePath(modulePath, sourceFile, pathResolutionMap = []) {
    if (modulePath.startsWith('.')) {
        modulePath = path.resolve(path.dirname(sourceFile.fileName), modulePath);
    }
    return (0, utils_1.resolvePath)(modulePath, pathResolutionMap);
}
function getImportNames(imprt) {
    var _a;
    if (!imprt.children) {
        return [];
    }
    return (_a = imprt.children) === null || _a === void 0 ? void 0 : _a.map(child => child).flatMap(child => { var _a; return (_a = child.children) === null || _a === void 0 ? void 0 : _a.map(namedImport => namedImport); }).flatMap(namedImport => { var _a; return (_a = namedImport === null || namedImport === void 0 ? void 0 : namedImport.children) === null || _a === void 0 ? void 0 : _a.map(importSpecifier => importSpecifier); }).map(importSpecifier => importSpecifier === null || importSpecifier === void 0 ? void 0 : importSpecifier.name).filter((name) => !!name);
}
//# sourceMappingURL=imports-map-factory.js.map