"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPath = void 0;
function convertPath(result, pathConversionMap) {
    let [importName, importModule, ...rest] = result;
    pathConversionMap.forEach((value) => {
        let [pathMatch, replacement] = value;
        if (typeof replacement === 'function') {
            replacement = replacement(...result);
        }
        importModule = importModule.replace(pathMatch, replacement)
            .replace('$importName', importName);
    });
    return [importName, importModule, ...rest];
}
exports.convertPath = convertPath;
//# sourceMappingURL=imports-path-convertor.js.map