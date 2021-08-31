import os from 'os';
import path from 'path';
import fs from 'fs';

/**
 * link your code to system commands
 */
export default class Linker {
  private currentOs: NodeJS.Platform;

  private startCommand = 'fef';

  private fileMode = 0o744;

  constructor(startCommand?: string) {
    this.currentOs = os.platform();
    startCommand && (this.startCommand = startCommand);
  }

  /**
   *
   * @param binPath
   * @param libPath
   * @param command it could be checkstyle or checkstyle@v0.0.5
   * @param name    always checkstyle, use command when it does not exist
   */
  register(binPath: string, libPath: string, command: string, name?: string) {
    if (this.currentOs === 'win32') {
      this.linkToWin32(binPath, command, name);
    } else {
      this.linkToUnixLike(binPath, libPath, command, name);
    }
  }

  /**
   * 注册自定义指定
   * @param binPath
   * @param libPath
   * @param command it could be checkstyle or checkstyle@v0.0.5
   * @param name    always checkstyle, use command when it does not exist
   */
  registerCustom(binPath: string, libPath: string, commands: string[], name: string) {
    if (this.currentOs === 'win32') {
      this.linkCustomeToWin32(binPath, commands, name);
    } else {
      this.linkCustomeToUnixLike(binPath, libPath, commands, name);
    }
  }

  remove(binPath: string, libPath: string, name: string) {
    if (this.currentOs === 'win32') {
      this.removeOnWin32(binPath, name);
    } else {
      this.removeOnUnixLike(binPath, libPath, name);
    }
  }

  private removeOnWin32(binPath: string, name: string) {
    const cmdFile = this.cmdFile(binPath, name);
    fs.unlinkSync(cmdFile);
  }

  private removeOnUnixLike(binPath: string, libPath: string, name: string) {
    const commandLink = path.join(binPath, name);
    fs.unlinkSync(commandLink);
    const shellFile = this.shellFile(libPath, name);
    fs.unlinkSync(shellFile);
  }

  private linkToWin32(binPath: string, command: string, name?: string) {
    this.enableDir(binPath);
    const file = this.cmdFile(binPath, name || command);
    const template = this.cmdTemplate(command);
    this.writeExecFile(file, template);
  }

  private linkCustomeToWin32(binPath: string, commands: string[], name: string) {
    this.enableDir(binPath);
    const file = this.cmdFile(binPath, name);
    const template = this.customeCmdTemplate(commands);
    this.writeExecFile(file, template);
  }

  private linkToUnixLike(binPath: string, libPath: string, command: string, name?: string) {
    this.enableDir(binPath, libPath);
    const file = this.shellFile(libPath, name || command);
    const template = this.shellTemplate(command);
    const commandLink = path.join(binPath, name || command);
    this.writeExecFile(file, template);
    if (fs.existsSync(commandLink) && fs.statSync(commandLink).isSymbolicLink) {
      return;
    }
    fs.symlinkSync(file, commandLink);
  }

  private linkCustomeToUnixLike(binPath: string, libPath: string, commands: string[], name: string) {
    this.enableDir(binPath, libPath);
    const file = this.shellFile(libPath, name);
    const template = this.customeShellTemplate(commands);
    const commandLink = path.join(binPath, name);
    this.writeExecFile(file, template);
    if (fs.existsSync(commandLink) && fs.statSync(commandLink).isSymbolicLink) {
      return;
    }
    fs.symlinkSync(file, commandLink);
  }

  private writeExecFile(file: string, content: string) {
    const exists = fs.existsSync(file);
    if (exists) {
      try {
        fs.accessSync(file, fs.constants.X_OK);
      } catch (e) {
        fs.chmodSync(file, this.fileMode);
      }
    }
    fs.writeFileSync(file, content, {
      mode: this.fileMode,
      flag: 'w',
      encoding: 'utf8',
    });
  }

  private shellTemplate(command: string): string {
    return `#!/bin/sh\n${this.startCommand} ${command} "$@"`;
  }

  private customeShellTemplate(commands: string[]): string {
    const commandStr = commands
      .map((cmd) => {
        let newCmd = cmd;
        return (newCmd += ' "$@"');
      })
      .join('\n');
    return `#!/bin/sh\n${commandStr}`;
  }

  private cmdTemplate(command: string): string {
    return `@echo off\n${this.startCommand} ${command} %*`;
  }

  private customeCmdTemplate(commands: string[]): string {
    const commandStr = commands
      .map((cmd) => {
        let newCmd = cmd;
        return (newCmd += ' %*');
      })
      .join('\n');
    return `@echo off\n${commandStr}`;
  }

  private shellFile(libPath: string, name: string): string {
    return path.join(libPath, `${name}.sh`);
  }

  private cmdFile(binPath: string, name: string): string {
    return path.join(binPath, `${name}.cmd`);
  }

  private enableDir(...dirs: string[]) {
    if (!dirs) {
      return;
    }
    dirs.forEach((d) => {
      if (fs.existsSync(d) && fs.statSync(d).isFile()) {
        fs.unlinkSync(d);
      }

      if (!fs.existsSync(d)) {
        fs.mkdirSync(d, { recursive: true });
      }
    });
  }
}
