/**
 * register the directory to the environment variable path
 */
export default class Binp {
    private currentOs;
    constructor();
    register(binPath: string, prior?: boolean, temporary?: boolean): void;
    private isRegisted;
    private registerToWin32;
    private registerToUnixLike;
    private checkTerminal;
    private handleUnsupportedTerminal;
    private detectProfile;
    private detectBashProfile;
    private detectCshProfile;
    private detectZshProfile;
    addToPath(file: string, content: string): void;
}
