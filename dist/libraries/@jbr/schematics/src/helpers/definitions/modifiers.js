"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeywordsAsString = exports.hasKeyword = exports.hasKeywords = exports.getDecoratorsAsString = exports.isDecoratedWith = exports.isDecorated = exports.isExport = exports.isDefault = exports.isDeclare = exports.isConst = exports.isAsync = exports.isAbstract = exports.isReadonly = exports.isStatic = exports.isProtected = exports.isPrivate = exports.isPublic = exports.getModifiers = void 0;
const ts = require("typescript");
const decorator_1 = require("./decorator");
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
            modifiers.decorators.push((0, decorator_1.getDecorator)(modifier, sourceFile));
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
function isPublic(name, modifiers) {
    return !(isPrivate(name, modifiers) || isProtected(name, modifiers));
}
exports.isPublic = isPublic;
function isPrivate(name, modifiers) {
    if (name.startsWith('#')) {
        return true;
    }
    return hasKeyword('private', modifiers);
}
exports.isPrivate = isPrivate;
function isProtected(name, modifiers) {
    if (isPrivate(name, modifiers)) {
        return false;
    }
    return hasKeyword('protected', modifiers);
}
exports.isProtected = isProtected;
function isStatic(modifiers) {
    return hasKeyword('static', modifiers);
}
exports.isStatic = isStatic;
function isReadonly(modifiers) {
    return hasKeyword('readonly', modifiers);
}
exports.isReadonly = isReadonly;
function isAbstract(modifiers) {
    return hasKeyword('abstract', modifiers);
}
exports.isAbstract = isAbstract;
function isAsync(modifiers) {
    return hasKeyword('async', modifiers);
}
exports.isAsync = isAsync;
function isConst(modifiers) {
    return hasKeyword('const', modifiers);
}
exports.isConst = isConst;
function isDeclare(modifiers) {
    return hasKeyword('declare', modifiers);
}
exports.isDeclare = isDeclare;
function isDefault(modifiers) {
    return hasKeyword('default', modifiers);
}
exports.isDefault = isDefault;
function isExport(modifiers) {
    return hasKeyword('export', modifiers);
}
exports.isExport = isExport;
function isDecorated(modifiers) {
    return !(!modifiers || !modifiers.decorators || !modifiers.decorators.length);
}
exports.isDecorated = isDecorated;
function isDecoratedWith(type, modifiers) {
    if (!isDecorated(modifiers)) {
        return false;
    }
    return modifiers.decorators.some(decorator => decorator.type === type);
}
exports.isDecoratedWith = isDecoratedWith;
function getDecoratorsAsString(modifiers, seperator = '\n') {
    if (!isDecorated(modifiers)) {
        return '';
    }
    return `${modifiers.decorators
        .map(decorator => decorator.signature)
        .join(seperator)}${seperator}
    }`;
}
exports.getDecoratorsAsString = getDecoratorsAsString;
function hasKeywords(modifiers) {
    return !(!modifiers || !modifiers.keywords || !modifiers.keywords.length);
}
exports.hasKeywords = hasKeywords;
function hasKeyword(keyword, modifiers) {
    if (!hasKeywords(modifiers)) {
        return false;
    }
    return modifiers.keywords.indexOf(keyword) !== -1;
}
exports.hasKeyword = hasKeyword;
function getKeywordsAsString(modifiers, seperator = ' ', showPublic = false) {
    if (!hasKeywords(modifiers)) {
        return '';
    }
    return `${modifiers.keywords
        .filter(keyword => showPublic || keyword !== 'public')
        .join(seperator)}${seperator}
  }`;
}
exports.getKeywordsAsString = getKeywordsAsString;
//# sourceMappingURL=modifiers.js.map