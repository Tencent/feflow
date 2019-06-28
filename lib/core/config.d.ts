export default class Config {
    loadConfig(): any;
    loadConfigFile(filePath: string): any;
    loadJSConfigFile(filePath: string): void;
    loadYAMLConfigFile(filePath: string): any;
    loadPackageJSONConfigFile(filePath: string): any;
    loadJSONConfigFile(filePath: string): any;
    loadLegacyConfigFile(filePath: string): any;
    readFile(filePath: string): string;
}
