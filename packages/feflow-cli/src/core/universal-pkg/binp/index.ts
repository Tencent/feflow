import os from 'os';
import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn';
import osenv from 'osenv';

/**
 * register the directory to the environment variable path
 */
export default class Binp {

    private currentOs: NodeJS.Platform;

    private alternativeProfiles = [
        '.profile', 
        '.bashrc', 
        '.bash_profile', 
        '.zshrc'
    ];

    constructor() {
        this.currentOs = os.platform();
    }

    register(binPath: string) {
        if (this.isRegisted(binPath)) {
            return;
        }
        if (this.currentOs === 'win32') {
            this.registerToWin32(binPath);
        } else {
            this.registerToUnixLike(binPath);
        }
    }

    private isRegisted(binPath: string): boolean {
        const pathStr = process.env['PATH'];
        let pathList: string[] = [];
        if (pathStr) {
            pathList = pathStr.split(path.delimiter);
        }
        return pathList.includes(binPath);
    }

    private registerToWin32(binPath: string) {
        const toPath = `${binPath};%path%`;
        spawn.sync('setx', ['path', toPath], { stdio: 'ignore' });
    }

    private registerToUnixLike(binPath: string) {
        const [profile, setStatement] = this.detectProfile(binPath);
        if (!profile) {
            throw 'not profile';
        }
        fs.appendFileSync(profile, setStatement);
    }

    private detectProfile(binPath: string): [string | undefined, string | undefined] {
        const home = osenv.home();
        const shell = process.env['SHELL'];
        const bashLinkeToPath = `\nexport PATH=${binPath}:$PATH\n`;
        const cshToPath = `\nset path = (${binPath} $path)\n`
        switch (shell) {
            case '/bin/zsh':
                return [this.detectZshProfile(home), bashLinkeToPath];
            case '/bin/bash':
            case '/bin/sh':
                return [this.detectBashProfile(home), bashLinkeToPath];
            case '/bin/zcsh':
            case '/bin/csh':
                return [this.detectCshProfile(home), cshToPath];
        }
        const profile = this.detectAlternativeProfiles(home);
        if (profile) {
            return [profile, bashLinkeToPath]
        }
        return [undefined, undefined]
    }

    private detectBashProfile(home: string): string | undefined {
        if (this.currentOs === 'darwin') {
            return path.join(home, '.bash_profile');
        }
        if (this.currentOs === 'linux') {
            return path.join(home, '.bashrc');
        }
    }

    private detectCshProfile(home: string): string | undefined {
        return path.join(home, '.tcshrc');
    }

    private detectZshProfile(home: string): string {
        return path.join(home, '.zshrc');
    }

    private detectAlternativeProfiles(home: string): string | undefined {
        const findFunc = (p: string) => {
            const absProfile = path.join(home, p);
            return fs.existsSync(absProfile);
        }
        return this.alternativeProfiles.find(findFunc);
    }

}