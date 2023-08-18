import * as ts from "typescript";


export function convertSourceFileToSymbol(program: ts.Program, sourceFile: ts.SourceFile): ts.Symbol | undefined {

  const typeChecker = program.getTypeChecker(),
    symbol = typeChecker.getSymbolAtLocation(sourceFile);

  if(!symbol) {
    console.log(`No symbols found in ${sourceFile.fileName}`);
  }

  return symbol;
}
