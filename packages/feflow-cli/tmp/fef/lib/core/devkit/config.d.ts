export default class Config {
    ctx: any;
    constructor(ctx: any);
    getProjectDirectory(): string;
    loadProjectConfig(): any;
    loadDevkitConfig(directoryPath: string): any;
    loadConfig(directoryPath: string, configArray: Array<string>): any;
    loadConfigFile(filePath: string): any;
    loadJSConfigFile(filePath: string): unknown;
    loadYAMLConfigFile(filePath: string): string | object;
    loadPackageJSONConfigFile(filePath: string): any;
    loadJSONConfigFile(filePath: string): any;
    loadLegacyConfigFile(filePath: string): string | object;
    readFile(filePath: string): string;
}
