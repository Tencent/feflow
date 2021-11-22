import Feflow from '@/core';
import { Command } from './command';
import { Dependencies } from './dependencies';
import { platform } from './base';

export class Plugin {
  path: string;

  name: string;

  desc: string;

  dep: Dependencies;

  command: Command;

  autoUpdate = true;

  test: Command;

  preInstall: Command;

  postInstall: Command;

  preRun: Command;

  postRun: Command;

  preUpgrade: Command;

  postUpgrade: Command;

  preUninstall: Command;

  postUninstall: Command;

  usage: any;

  // 是否属于语言运行时，语言运行时不需要经过feflow代理执行
  langRuntime = false;

  private readonly ctx: Feflow;

  constructor(ctx: Feflow, pluginPath: string, config: any) {
    if (!platform) {
      throw new Error(`current operating system [${platform}] is not supported`);
    }
    this.ctx = ctx;
    this.path = pluginPath;
    this.name = config?.name;
    this.desc = config?.desc;
    this.dep = new Dependencies(config?.dep);
    this.command = new Command(this.ctx, this.path, config?.command);
    this.autoUpdate = config?.['auto-update'] || false;
    this.test = new Command(this.ctx, this.path, config?.test);
    this.preInstall = new Command(this.ctx, this.path, config?.['pre-install']);
    this.postInstall = new Command(this.ctx, this.path, config?.['post-install']);
    this.preRun = new Command(this.ctx, this.path, config?.['pre-run']);
    this.postRun = new Command(this.ctx, this.path, config?.['post-run']);
    this.preUpgrade = new Command(this.ctx, this.path, config?.['pre-upgrade']);
    this.postUpgrade = new Command(this.ctx, this.path, config?.['post-upgrade']);
    this.preUninstall = new Command(this.ctx, this.path, config?.['pre-uninstall']);
    this.postUninstall = new Command(this.ctx, this.path, config?.['post-uninstall']);
    this.usage = config?.usage;
    this.langRuntime = config?.['lang-runtime'] || false;
  }

  async check() {
    await this.dep.check();
    this.command.check();
  }
}
