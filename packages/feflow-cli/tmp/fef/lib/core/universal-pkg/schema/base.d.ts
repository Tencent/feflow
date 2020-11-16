/// <reference types="node" />
declare const platform: NodeJS.Platform;
declare const platformType: any;
declare function toArray(v: any, field: string, defaultV?: string[]): string[];
export { platform, platformType, toArray };
