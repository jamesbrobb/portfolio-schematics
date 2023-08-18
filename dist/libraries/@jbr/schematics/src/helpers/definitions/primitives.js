"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTupleDeclaration = void 0;
function getTupleDeclaration(node, sourceFile) {
    return {
        raw: node.getText(sourceFile)
    };
}
exports.getTupleDeclaration = getTupleDeclaration;
//# sourceMappingURL=primitives.js.map