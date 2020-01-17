export default class Config {
    ctx: any;
    constructor(ctx: any);
    getConfigDirectory(): string;
    loadConfig(): any;
    loadConfigFile(filePath: string): any;
    loadJSConfigFile(filePath: string): unknown;
    loadYAMLConfigFile(filePath: string): any;
    loadPackageJSONConfigFile(filePath: string): any;
    loadJSONConfigFile(filePath: string): any;
    loadLegacyConfigFile(filePath: string): any;
    readFile(filePath: string): string;
    getDevKitConfig(ctx: any, cmd: any): any;
}
