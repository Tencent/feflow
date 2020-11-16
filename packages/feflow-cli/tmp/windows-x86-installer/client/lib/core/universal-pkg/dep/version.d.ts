interface Version {
    check(version: any): boolean;
    valid(version: string): string;
    satisfies(version: string, range: string): boolean;
    gt(v1: string, v2: string): boolean;
}
declare class SemverVersion implements Version {
    latestVersion: string;
    check(version: any): boolean;
    valid(version: string): string;
    toFull(version: string): string;
    satisfies(version: string, range: string): boolean;
    gt(v1: string, v2: string): boolean;
}
declare const _default: SemverVersion;
export default _default;
