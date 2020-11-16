export declare class Command {
    private val;
    private ctx;
    private default;
    private macos;
    private linux;
    private windows;
    constructor(ctx: any, pluginPath: string, command: any);
    getCommands(): string[];
    run(...args: string[]): void;
    runLess(): void;
    check(): void;
}
