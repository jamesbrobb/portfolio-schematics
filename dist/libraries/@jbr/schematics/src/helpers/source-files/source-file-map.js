"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _SourceFileMap_keyRegex, _SourceFileMap_pathResolutionMap, _SourceFileMap_duplicatePathPrecedenceMap, _SourceFileMap_debug, _SourceFileMap_map;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SourceFileMap = exports.sourceFileMapKeyRegex = void 0;
const utils_1 = require("../utils");
exports.sourceFileMapKeyRegex = /^((@.*?\/)*[^\/]*)/g;
class SourceFileMap {
    constructor(options) {
        _SourceFileMap_keyRegex.set(this, exports.sourceFileMapKeyRegex);
        _SourceFileMap_pathResolutionMap.set(this, []);
        _SourceFileMap_duplicatePathPrecedenceMap.set(this, []);
        _SourceFileMap_debug.set(this, false);
        _SourceFileMap_map.set(this, new Map());
        __classPrivateFieldSet(this, _SourceFileMap_keyRegex, (options === null || options === void 0 ? void 0 : options.moduleKeyRegex) || __classPrivateFieldGet(this, _SourceFileMap_keyRegex, "f"), "f");
        __classPrivateFieldSet(this, _SourceFileMap_pathResolutionMap, (options === null || options === void 0 ? void 0 : options.pathResolutionMap) || __classPrivateFieldGet(this, _SourceFileMap_pathResolutionMap, "f"), "f");
        __classPrivateFieldSet(this, _SourceFileMap_duplicatePathPrecedenceMap, (options === null || options === void 0 ? void 0 : options.duplicatePathPrecedenceMap) || __classPrivateFieldGet(this, _SourceFileMap_duplicatePathPrecedenceMap, "f"), "f");
        __classPrivateFieldSet(this, _SourceFileMap_debug, (options === null || options === void 0 ? void 0 : options.debug) || __classPrivateFieldGet(this, _SourceFileMap_debug, "f"), "f");
    }
    set(modulePath, entityName, kind, ...extras) {
        var _a;
        modulePath = (0, utils_1.resolvePath)(modulePath, __classPrivateFieldGet(this, _SourceFileMap_pathResolutionMap, "f"));
        const key = ((_a = modulePath.match(__classPrivateFieldGet(this, _SourceFileMap_keyRegex, "f"))) === null || _a === void 0 ? void 0 : _a[0]) || '';
        if (!key && __classPrivateFieldGet(this, _SourceFileMap_debug, "f")) {
            (0, utils_1.log)(`${entityName} skipped for ${modulePath}`, 'NO KEY FOUND');
            return;
        }
        const moduleMap = __classPrivateFieldGet(this, _SourceFileMap_map, "f").get(key) || new Map(), existingElement = moduleMap.get(entityName);
        if (existingElement) {
            const resolution = (0, utils_1.resolveDuplicatePath)(existingElement[0], modulePath, __classPrivateFieldGet(this, _SourceFileMap_duplicatePathPrecedenceMap, "f"));
            modulePath = resolution === 1 ? modulePath : existingElement[0];
            if (resolution === 0 && __classPrivateFieldGet(this, _SourceFileMap_debug, "f")) {
                (0, utils_1.log)(`Name: ${entityName}\nStored path: ${moduleMap.get(entityName)}\nDuplicate path: ${modulePath}`, 'DUPLICATE NAME FOUND');
                return;
            }
        }
        moduleMap.set(entityName, [modulePath, kind, ...extras]);
        __classPrivateFieldGet(this, _SourceFileMap_map, "f").set(key, moduleMap);
    }
    get(modulePath, entityName) {
        var _a;
        const key = ((_a = modulePath.match(__classPrivateFieldGet(this, _SourceFileMap_keyRegex, "f"))) === null || _a === void 0 ? void 0 : _a[0]) || '';
        if (!key) {
            if (__classPrivateFieldGet(this, _SourceFileMap_debug, "f")) {
                (0, utils_1.log)(`${entityName} skipped for ${modulePath}`, 'NO KEY FOUND');
            }
            return;
        }
        const moduleMap = __classPrivateFieldGet(this, _SourceFileMap_map, "f").get(key);
        if (!moduleMap) {
            if (__classPrivateFieldGet(this, _SourceFileMap_debug, "f")) {
                console.log(`No source module map found for ${key}`);
            }
            return;
        }
        return moduleMap.get(entityName);
    }
    toString() {
        console.log(__classPrivateFieldGet(this, _SourceFileMap_map, "f"));
        return '';
    }
}
exports.SourceFileMap = SourceFileMap;
_SourceFileMap_keyRegex = new WeakMap(), _SourceFileMap_pathResolutionMap = new WeakMap(), _SourceFileMap_duplicatePathPrecedenceMap = new WeakMap(), _SourceFileMap_debug = new WeakMap(), _SourceFileMap_map = new WeakMap();
//# sourceMappingURL=source-file-map.js.map