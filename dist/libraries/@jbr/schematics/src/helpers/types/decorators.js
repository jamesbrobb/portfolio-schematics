"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecoratorMetadata = exports.getDecorator = exports.KEYLESS_TOKEN = void 0;
const ts = require("typescript");
const helpers_1 = require("../helpers");
exports.KEYLESS_TOKEN = Symbol('keyless');
function getDecorator(node, sourceFile) {
    if (!ts.isCallLikeExpression(node)) {
        throw new Error("Decorator Node is not a call like expression");
    }
    if (!ts.isCallExpression(node.expression)) {
        throw new Error("Decorator Node.expression is not a call expression");
    }
    return {
        type: node.expression.expression.getText(sourceFile),
        metadata: getDecoratorMetadata(node.expression, sourceFile),
        raw: node.getText(sourceFile)
    };
}
exports.getDecorator = getDecorator;
function getDecoratorMetadata(node, sourceFile) {
    const metadata = {};
    node.arguments.forEach(arg => {
        if (ts.isIdentifier(arg) || ts.isStringLiteral(arg)) {
            metadata[exports.KEYLESS_TOKEN] = (0, helpers_1.getText)(arg, sourceFile);
            return;
        }
        if (ts.isObjectLiteralExpression(arg)) {
            arg.properties.forEach(prop => {
                if (!prop.name || !ts.isIdentifier(prop.name)) {
                    throw new Error(`Property name is not an identifier - ${prop}`);
                }
                if (!ts.isPropertyAssignment(prop)) {
                    throw new Error(`Property is not a property assignment - ${prop}`);
                }
                const key = prop.name.getText(sourceFile);
                metadata[key] = (0, helpers_1.getText)(prop.initializer, sourceFile);
            });
        }
    });
    return metadata;
}
exports.getDecoratorMetadata = getDecoratorMetadata;
//# sourceMappingURL=decorators.js.map