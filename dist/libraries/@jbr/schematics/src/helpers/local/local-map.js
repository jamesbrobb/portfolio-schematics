"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLocalMap = void 0;
const utilities_1 = require("../utilities");
const utils_1 = require("../utils");
function createLocalMap(program, sourceFile) {
    return new Map((0, utilities_1.getExportedDeclarationsFromSource)(program, sourceFile)
        .map(node => [
        'name' in node && node.name ? (0, utils_1.getText)(node.name, sourceFile) : 'Name not found',
        [node.kind, node]
    ]));
}
exports.createLocalMap = createLocalMap;
//# sourceMappingURL=local-map.js.map