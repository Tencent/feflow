export declare function getRegistryUrl(packageManager: string): Promise<any>;
export declare function install(packageManager: string, root: any, cmd: any, dependencies: any, verbose: boolean, isOnline: boolean): Promise<unknown>;
export declare function getTag(repoUrl: string, version?: string): Promise<string>;
export declare function getLatestTag(repoUrl: string): Promise<string>;
export declare function checkoutVersion(repoPath: string, version: string): Promise<unknown>;
