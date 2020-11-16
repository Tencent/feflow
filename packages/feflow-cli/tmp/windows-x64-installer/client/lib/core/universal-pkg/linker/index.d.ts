/**
 * link your code to system commands
 */
export default class Linker {
    private currentOs;
    private startCommand;
    private fileMode;
    constructor(startCommand?: string);
    /**
     *
     * @param binPath
     * @param libPath
     * @param command it could be checkstyle or checkstyle@v0.0.5
     * @param name    always checkstyle, use command when it does not exist
     */
    register(binPath: string, libPath: string, command: string, name?: string): void;
    remove(binPath: string, libPath: string, name: string): void;
    private removeOnWin32;
    private removeOnUnixLike;
    private linkToWin32;
    private linkToUnixLike;
    private writeExecFile;
    private shellTemplate;
    private cmdTemplate;
    private shellFile;
    private cmdFile;
    private enableDir;
}
