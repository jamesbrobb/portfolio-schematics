"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSetAccessorDeclaration = exports.getGetAccessorDeclaration = exports.getMethodDeclaration = exports.getPropertyDeclaration = exports.getConstructor = exports.getHeritageClause = exports.getParameter = exports.getModifiers = void 0;
const ts = require("typescript");
const decorators_1 = require("./decorators");
const helpers_1 = require("../helpers");
const modifiersMap = {
    [ts.SyntaxKind.PrivateKeyword]: 'private',
    [ts.SyntaxKind.ProtectedKeyword]: 'protected',
    [ts.SyntaxKind.PublicKeyword]: 'public',
    [ts.SyntaxKind.StaticKeyword]: 'static',
    [ts.SyntaxKind.ReadonlyKeyword]: 'readonly',
    [ts.SyntaxKind.AbstractKeyword]: 'abstract',
    [ts.SyntaxKind.AsyncKeyword]: 'async',
    [ts.SyntaxKind.ConstKeyword]: 'const',
    [ts.SyntaxKind.DeclareKeyword]: 'declare',
    [ts.SyntaxKind.DefaultKeyword]: 'default',
    [ts.SyntaxKind.ExportKeyword]: 'export'
};
function getModifiers(node, sourceFile) {
    if (!('modifiers' in node) || !Array.isArray(node.modifiers) || node.modifiers.length === 0) {
        return;
    }
    const modifiers = {};
    node.modifiers.forEach(modifier => {
        if (ts.isDecorator(modifier)) {
            if (!modifiers.decorators) {
                modifiers.decorators = [];
            }
            modifiers.decorators.push((0, decorators_1.getDecorator)(modifier, sourceFile));
            return;
        }
        const keyword = modifiersMap[modifier.kind];
        if (keyword) {
            if (!modifiers.keywords) {
                modifiers.keywords = [];
            }
            modifiers.keywords.push(keyword);
        }
    });
    return modifiers;
}
exports.getModifiers = getModifiers;
function getParameter(node, sourceFile) {
    const name = (0, helpers_1.getText)(node.name, sourceFile), type = node.type ? (0, helpers_1.getText)(node.type, sourceFile) : undefined, optional = !!node.questionToken, modifiers = getModifiers(node, sourceFile);
    return {
        name,
        type,
        optional,
        modifiers
    };
}
exports.getParameter = getParameter;
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
function getConstructor(node, sourceFile) {
    return {
        parameters: node.parameters.map(param => getParameter(param, sourceFile))
    };
}
exports.getConstructor = getConstructor;
function getPropertyDeclaration(node, sourceFile) {
    const name = (0, helpers_1.getText)(node.name, sourceFile), modifiers = getModifiers(node, sourceFile);
    return {
        name,
        isDecorated: !!modifiers && !!modifiers.decorators,
        type: node.type ? (0, helpers_1.getText)(node.type, sourceFile) : undefined,
        optional: !!node.questionToken,
        exclamation: !!node.exclamationToken,
        modifiers,
        initializedValue: node.initializer ? (0, helpers_1.getText)(node.initializer, sourceFile) : undefined,
        raw: node.getText(sourceFile),
        isPublic: (0, helpers_1.isPublic)(name, modifiers)
    };
}
exports.getPropertyDeclaration = getPropertyDeclaration;
function getDecoratorSignature(decorator) {
    const metaData = Reflect.ownKeys(decorator.metadata)
        .map(key => {
        const value = decorator.metadata[key];
        if (key === decorators_1.KEYLESS_TOKEN) {
            return [value];
        }
        return [key, value];
    })
        .sort((a, b) => a.length - b.length)
        .reduce((accumulator, currentValue, currentIndex, array) => {
        if (currentValue.length === 1) {
            return `${accumulator}'${currentValue[0]}'${currentIndex === array.length - 1 ? '' : ', '}`;
        }
        return `${accumulator}${currentIndex === 0 || array[currentIndex - 1].length === 1 ? '{' : ''}${currentValue[0]}: ${currentValue[1]}${currentIndex === array.length - 1 ? '}' : ', '}`;
    }, '');
    return `@${decorator.type}(${metaData})`;
}
function getMethodSignature(name, parameters, modifiers, type = 'void') {
    const params = `${parameters.map(param => `${param.name}${param.type ? ': ' + param.type : ''}`).join(', ')}`;
    let decorators = '', keywords = '';
    if (modifiers) {
        if (modifiers.keywords) {
            keywords = `${modifiers.keywords
                .filter(keyword => keyword !== 'public')
                .map(keyword => `${keyword} `)
                .join('')}`;
        }
        if (modifiers.decorators) {
            decorators = `${modifiers.decorators
                .map(decorator => `${getDecoratorSignature(decorator)}`).join('\n')}\n`;
        }
    }
    return `${decorators}${keywords}${name}(${params}): ${type === 'void' && keywords.includes('async') ? 'Promise<void>' : type}`;
}
function getMethodDeclaration(node, sourceFile) {
    const name = (0, helpers_1.getText)(node.name, sourceFile), type = node.type ? (0, helpers_1.getText)(node.type, sourceFile) : undefined, parameters = node.parameters.map(param => getParameter(param, sourceFile)), modifiers = getModifiers(node, sourceFile);
    return {
        name,
        type,
        parameters,
        modifiers,
        signature: getMethodSignature(name, parameters, modifiers, type),
        isPublic: (0, helpers_1.isPublic)(name, modifiers)
    };
}
exports.getMethodDeclaration = getMethodDeclaration;
function getGetAccessorDeclaration(node, sourceFile) {
    return {
        name: (0, helpers_1.getText)(node.name, sourceFile),
        type: node.type ? (0, helpers_1.getText)(node.type, sourceFile) : undefined,
        modifiers: getModifiers(node, sourceFile)
    };
}
exports.getGetAccessorDeclaration = getGetAccessorDeclaration;
function getSetAccessorDeclaration(node, sourceFile) {
    return {
        name: (0, helpers_1.getText)(node.name, sourceFile),
        type: node.type ? (0, helpers_1.getText)(node.type, sourceFile) : undefined,
        parameters: node.parameters.map(param => getParameter(param, sourceFile)),
        modifiers: getModifiers(node, sourceFile)
    };
}
exports.getSetAccessorDeclaration = getSetAccessorDeclaration;
//# sourceMappingURL=definition-types.js.map