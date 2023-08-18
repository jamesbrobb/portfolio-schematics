"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDecorator = void 0;
const ts = require("typescript");
const utils_1 = require("../utils");
function getDecorator(node, sourceFile) {
    if (!ts.isCallLikeExpression(node)) {
        throw new Error("Decorator Node is not a call like expression");
    }
    if (!ts.isCallExpression(node.expression)) {
        throw new Error("Decorator Node.expression is not a call expression");
    }
    const type = node.expression.expression.getText(sourceFile), metadata = getDecoratorMetadata(node.expression, sourceFile);
    return {
        kind: 'decorator',
        type,
        metadata,
        signature: getDecoratorSignature(type, metadata),
        raw: node.getText(sourceFile)
    };
}
exports.getDecorator = getDecorator;
function getDecoratorMetadata(node, sourceFile) {
    let metadata;
    node.arguments.forEach(arg => {
        if (ts.isIdentifier(arg) || ts.isStringLiteral(arg)) {
            metadata = (0, utils_1.getText)(arg, sourceFile);
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
                metadata = metadata || {};
                metadata[key] = (0, utils_1.getText)(prop.initializer, sourceFile);
            });
        }
    });
    return metadata;
}
function getDecoratorSignature(type, metaData) {
    if (!metaData) {
        return `@${type}()`;
    }
    if (typeof metaData === 'string') {
        return `@${type}('${metaData}')`;
    }
    const options = Reflect.ownKeys(metaData)
        .map(key => {
        const value = metaData[key];
        return [key, value];
    })
        .sort((a, b) => a.length - b.length)
        .reduce((accumulator, currentValue, currentIndex, array) => {
        if (currentValue.length === 1) {
            return `${accumulator}'${currentValue[0]}'${currentIndex === array.length - 1 ? '' : ', '}`;
        }
        return `${accumulator}${currentIndex === 0 || array[currentIndex - 1].length === 1 ? '{' : ''}${currentValue[0]}: ${currentValue[1]}${currentIndex === array.length - 1 ? '}' : ', '}`;
    }, '');
    return `@${type}(${options})`;
}
//# sourceMappingURL=decorator.js.map