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
    const [profile, setStatement] = this.detectProfile(binPath, prior);
    if (!profile) {
      throw 'not profile';
    }
    fs.appendFileSync(profile, `\n${setStatement}\n`);
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
    switch (shell) {
      case '/bin/zsh':
        return [this.detectZshProfile(home), toPath];
      case '/bin/bash':
      case '/bin/sh':
        return [this.detectBashProfile(home), toPath];
      case '/bin/zcsh':
      case '/bin/csh':
        if (prior) {
          toPath = `set path = (${binPath} $path)`;
        } else {
          toPath = `set path = ($path ${binPath})`;
        }
        return [this.detectCshProfile(home), toPath];
    }
    const profile = this.detectAlternativeProfiles(home);
    if (profile) {
      return [profile, toPath];
    }
    return [undefined, undefined];
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
    };
    return this.alternativeProfiles.find(findFunc);
  }
}
