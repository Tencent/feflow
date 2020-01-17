export default class Feflow {
    args: any;
    projectConfig: any;
    version: string;
    logger: any;
    commander: any;
    root: any;
    rootPkg: any;
    config: any;
    configPath: any;
    constructor(args: any);
    init(cmd: string): Promise<void>;
    initClient(): Promise<any>;
    initPackageManager(): Promise<any>;
    checkUpdate(): Promise<void | undefined> | undefined;
    updatePluginsVersion(packagePath: string, plugins: any): void;
    getInstalledPlugins(): any;
    loadNative(): Promise<any>;
    loadInternalPlugins(): void;
    call(name: any, ctx: any): Promise<any>;
    updateCli(packageManager: string): Promise<unknown>;
    checkCliUpdate(): Promise<void>;
    showCommandOptionDescription(cmd: any, ctx: any): Promise<any>;
    getOptionItem(optionItemConfig: any, option: any): object;
}
