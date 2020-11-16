import { PkgRelation } from './relation';
export declare class UniversalPkg {
    private pkgFile;
    private version;
    private installed;
    private dependencies;
    constructor(pkgFile: string);
    private toDependencies;
    getInstalled(): Map<string, string>;
    isInstalled(pkg: string, version?: string, includeDep?: boolean): boolean;
    install(pkg: string, version: string): void;
    isDepdenedOnOther(pkg: string, version: string): boolean;
    depend(pkg: string, version: string, dependPkg: string, dependPkgVersion: string): void;
    removeInvalidDependencies(): [string, string][];
    private isValid;
    removeDepend(pkg: string, version: string, dependPkg: string, dependPkgVersion: string): number;
    private dependedOn;
    uninstall(pkg: string, version: string, isDep?: boolean): void;
    removeDepended(pkg: string, version: string, dependedPkg: string, dependedVersion: string): void;
    getDepended(pkg: string, version: string): Map<string, string> | undefined;
    getDependencies(pkg: string, version: string): Map<string, string> | undefined;
    getPkgRelation(pkg: string, version: string): PkgRelation | undefined;
    getAllDependencies(): Map<string, Map<string, PkgRelation>>;
    saveChange(): void;
    private toObject;
}
