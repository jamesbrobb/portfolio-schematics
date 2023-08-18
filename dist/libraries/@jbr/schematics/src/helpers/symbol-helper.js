"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertSourceFileToSymbol = void 0;
function convertSourceFileToSymbol(program, sourceFile) {
    const typeChecker = program.getTypeChecker(), symbol = typeChecker.getSymbolAtLocation(sourceFile);
    if (!symbol) {
        console.log(`No symbols found in ${sourceFile.fileName}`);
    }
    return symbol;
}
exports.convertSourceFileToSymbol = convertSourceFileToSymbol;
//# sourceMappingURL=symbol-helper.js.map