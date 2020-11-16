import { Command } from './command';
import { Dependencies } from './dependencies';
export declare class Plugin {
    private ctx;
    path: string;
    desc: string;
    dep: Dependencies;
    command: Command;
    autoUpdate: boolean;
    test: Command;
    preInstall: Command;
    postInstall: Command;
    preRun: Command;
    postRun: Command;
    preUpgrade: Command;
    postUpgrade: Command;
    usage: any;
    constructor(ctx: any, pluginPath: string, config: any);
    check(): Promise<void>;
}
