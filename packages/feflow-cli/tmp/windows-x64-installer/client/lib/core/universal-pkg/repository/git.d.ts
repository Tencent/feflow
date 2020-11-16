/// <reference types="node" />
import childProcess from 'child_process';
export declare function getTag(repoUrl: string, version?: string): Promise<string | undefined>;
export declare function getCurrentTag(repoPath: string): Promise<string | undefined>;
export declare function checkoutVersion(repoPath: string, version: string): childProcess.SpawnSyncReturns<Buffer>;
