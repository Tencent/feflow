export declare class Dependencies {
    os: string[];
    command: string[];
    plugin: string[];
    arch: string[];
    constructor(dep: any);
    check(): Promise<void>;
    private checkOs;
    private checkCommand;
}
