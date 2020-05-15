import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * link your code to system commands
 */
export default class Linker {
    
    private currentOs: NodeJS.Platform;

    private fileMode = 0o744;

    constructor() {
        this.currentOs = os.platform();
    }

    register(binPath: string, libPath: string, command: string) {
        if (this.currentOs === 'win32') {
            this.linkToWin32(binPath, command);
        }
        this.linkToUnixLike(binPath, libPath, command);
    }

    private linkToWin32(binPath: string, command: string) {
        const file = this.cmdFile(binPath, command);
        const template = this.cmdTemplate(command);
        this.writeExecFile(file, template);
    }

    private linkToUnixLike(binPath: string, libPath: string, command: string) {
        const file = this.shellFile(libPath, command);
        const template = this.shellTemplate(command);
        const commandLink = path.join(binPath, command);
        this.writeExecFile(file, template);
        fs.symlinkSync(file, commandLink);
    }

    private writeExecFile(file: string, content: string) {
        const exists = fs.existsSync(file);
        if (exists) {
            try {
                fs.accessSync(file, fs.constants.X_OK);
            } catch(e) {
                fs.chmodSync(file, this.fileMode);
            }
        } 
        fs.writeFileSync(file, content, {
            mode: this.fileMode,
            flag: 'w',
            encoding: 'utf8'
        });
    }

    private shellTemplate(command: string): string {
        return `#!/bin/sh
        fef ${command} "$@"
        `;
    }

    private cmdTemplate(command: string): string {
        return `@echo off
        fef ${command} %*
        `;
    }

    private shellFile(libPath: string, command: string): string {
        return path.join(libPath, `${command}.sh`);
    }

    private cmdFile(binPath: string, command: string): string {
        return path.join(binPath, `${command}.cmd`)
    }

}