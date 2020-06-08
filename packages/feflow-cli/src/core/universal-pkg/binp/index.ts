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
      this.registerToUnixLike(binPath, prior);
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
    fs.appendFileSync(zshProfile, `\n${toPath}\n`);
    const bashProfile = this.detectBashProfile(home);
    fs.appendFileSync(bashProfile, `\n${toPath}\n`);
    if (prior) {
      toPath = `set path = (${binPath} $path)`;
    } else {
      toPath = `set path = ($path ${binPath})`;
    }
    const cshProfile = this.detectCshProfile(home);
    fs.appendFileSync(cshProfile, `\n${toPath}\n`);
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

}
