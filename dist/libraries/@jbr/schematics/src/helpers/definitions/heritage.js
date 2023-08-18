"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHeritageClausesByType = exports.getHeritageClause = void 0;
const ts = require("typescript");
function getHeritageClause(node, sourceFile) {
    const hClause = {
        kind: 'heritage',
        types: []
    };
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
function getHeritageClausesByType(type, clauses) {
    return clauses.filter(clause => clause.keyword === type)
        .map(clause => clause.types);
}
exports.getHeritageClausesByType = getHeritageClausesByType;
//# sourceMappingURL=heritage.js.map