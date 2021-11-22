import { platformType, toArray } from './base';
import { lookpath } from 'lookpath';

export class Dependencies {
  os: string[];

  command: string[];

  plugin: string[];

  arch: string[];

  constructor(dep: any) {
    this.os = toArray(dep?.os, 'os');
    this.command = toArray(dep?.command, 'command');
    this.plugin = toArray(dep?.plugin, 'plugin');
    this.arch = toArray(dep?.arch, 'arch');
  }

  public async check() {
    this.checkOs();
    await this.checkCommand();
  }

  private checkOs() {
    if (this.os.length === 0) {
      return;
    }
    if (!this.os.includes(platformType)) {
      throw new Error(`the plugin does not support the ${platformType} operating system`);
    }
  }

  private async checkCommand() {
    for (const command of this.command) {
      try {
        await lookpath(command);
      } catch (e) {
        throw new Error(`${command} command does not exist in the system, please check before installing this plugin`);
      }
    }
  }
}
