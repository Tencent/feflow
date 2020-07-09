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

  constructor() {
    this.currentOs = os.platform();
  }

  register(binPath: string, prior: boolean = false, temporary = false) {
    if (this.isRegisted(binPath)) {
      return;
    }
    if (temporary) {
      let newPath: string;
      if (prior) {
        newPath = `${binPath}${path.delimiter}${process.env['PATH']}`;
      } else {
        newPath = `${process.env['PATH']}${path.delimiter}${binPath}`;
      }
      process.env['PATH'] = newPath;
      return;
    }
    if (this.currentOs === 'win32') {
      this.registerToWin32(binPath, prior);
    } else {
      const profile = this.checkTerminal(binPath, prior);
      if (profile) {
        this.registerToUnixLike(binPath, prior);
        this.handleUnsupportedTerminal(profile);
      }
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

  private registerToWin32(binPath: string, prior: boolean) {
    const pathStr = process.env['PATH'];
    let toPath: string;
    if (prior) {
      toPath = `${binPath};${pathStr}`;
    } else {
      toPath = `${pathStr};${binPath}`;
    }
    spawn.sync('setx', ['path', toPath, '/m'], { stdio: 'ignore' });
  }

  private registerToUnixLike(binPath: string, prior: boolean) {
    let toPath: string;
    if (prior) {
      toPath = `export PATH=${binPath}:$PATH`;
    } else {
      toPath = `export PATH=$PATH:${binPath}`;
    }
    const home = osenv.home();
    const zshProfile = this.detectZshProfile(home);
    this.addToPath(zshProfile, toPath);
    const bashProfile = this.detectBashProfile(home);
    this.addToPath(bashProfile, toPath);
    if (prior) {
      toPath = `set path = (${binPath} $path)`;
    } else {
      toPath = `set path = ($path ${binPath})`;
    }
    const cshProfile = this.detectCshProfile(home);
    this.addToPath(cshProfile, toPath);
  }

  private checkTerminal(
    binPath: string,
    prior: boolean
  ) {
    const [profile, setStatement] = this.detectProfile(binPath, prior);
    if (!profile || !setStatement) {
      console.warn(`unknown terminal, please add ${binPath} to the path`);
      return;
    }
    const content = fs.readFileSync(profile)?.toString();
    if (content?.indexOf(setStatement) === -1) {
      return profile;
    }
    this.handleUnsupportedTerminal(profile);
  }

  private handleUnsupportedTerminal(profile: string) {
    console.error('the current terminal cannot use feflow normally, please open a new terminal or execute the following statement:');
    console.error(`source ${profile}`);
    process.exit(1);
  }

  private detectProfile(
    binPath: string,
    prior: boolean
  ): [string | undefined, string | undefined] {
    const home = osenv.home();
    const shell = process.env['SHELL'];
    let toPath: string;
    if (prior) {
      toPath = `export PATH=${binPath}:$PATH`;
    } else {
      toPath = `export PATH=$PATH:${binPath}`;
    }
    if (!shell) {
      return [undefined, undefined];
    }
    const shellMatch = shell.match(/(zsh|bash|sh|zcsh|csh)/);
    let shellType: string = '';
    if (Array.isArray(shellMatch) && shellMatch.length > 0) {
      shellType = shellMatch[0];
    }
    switch (shellType) {
      case 'zsh':
        return [this.detectZshProfile(home), toPath];
      case 'bash':
      case 'sh':
        return [this.detectBashProfile(home), toPath];
      case 'zcsh':
      case 'csh':
        if (prior) {
          toPath = `set path = (${binPath} $path)`;
        } else {
          toPath = `set path = ($path ${binPath})`;
        }
        return [this.detectCshProfile(home), toPath];
    }
    return [undefined, undefined];
  }

  private detectBashProfile(home: string): string {
    if (this.currentOs === 'darwin') {
      return path.join(home, '.bash_profile');
    }
    return path.join(home, '.bashrc');
  }

  private detectCshProfile(home: string): string {
    return path.join(home, '.tcshrc');
  }

  private detectZshProfile(home: string): string {
    return path.join(home, '.zshrc');
  }

  addToPath(file: string, content: string) {
    try {
      fs.appendFileSync(file, `\n${content}\n`);
    } catch(e) {
      console.error(e);
      console.warn(`registration path to ${file} failed. If the file does not exist, you can try to create it`);
    }
  }

}
