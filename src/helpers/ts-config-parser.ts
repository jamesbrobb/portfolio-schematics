import * as ts from "typescript";

export function getParsedConfig(): ts.ParsedCommandLine {

  const appConfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.app.json"),
    libConfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.lib.json"),
    tsConfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json"),
    configPath = appConfigPath || libConfigPath || tsConfigPath;

  if(!configPath) {
    throw new Error("No tsconfig.json | tsconfig.app.json | tsconfig.lib.json found");
  }

  const configSourceFile = ts.readJsonConfigFile(configPath, ts.sys.readFile);

  return ts.parseJsonSourceFileConfigFileContent(configSourceFile, ts.sys, process.cwd(), undefined, configPath);
}
