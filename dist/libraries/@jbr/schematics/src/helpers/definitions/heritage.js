"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeritageClause = void 0;
const ts = require("typescript");
function getHeritageClause(node, sourceFile) {
    const hClause = { types: [] };
    node.getChildren(sourceFile)
        .forEach(node => {
        switch (node.kind) {
            case ts.SyntaxKind.ExtendsKeyword:
                hClause.keyword = 'extends';
                break;
            case ts.SyntaxKind.ImplementsKeyword:
                hClause.keyword = 'implements';
                break;
        }
        if (node.kind === ts.SyntaxKind.SyntaxList) {
            node.getChildren(sourceFile)
                .forEach(node => {
                if (node.kind === ts.SyntaxKind.ExpressionWithTypeArguments) {
                    hClause.types.push(node.getText(sourceFile));
                }
            });
        }
    });
    return hClause;
}
exports.getHeritageClause = getHeritageClause;
//# sourceMappingURL=heritage.js.map