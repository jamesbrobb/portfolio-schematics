"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParsedConfig = void 0;
const ts = require("typescript");
function getParsedConfig() {
    const appConfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.app.json"), libConfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.lib.json"), tsConfigPath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, "tsconfig.json"), configPath = appConfigPath || libConfigPath || tsConfigPath;
    if (!configPath) {
        throw new Error("No tsconfig.json | tsconfig.app.json | tsconfig.lib.json found");
    }
    const configSourceFile = ts.readJsonConfigFile(configPath, ts.sys.readFile);
    return ts.parseJsonSourceFileConfigFileContent(configSourceFile, ts.sys, process.cwd(), undefined, configPath);
}
exports.getParsedConfig = getParsedConfig;
//# sourceMappingURL=ts-config-parser.js.map