import { Command } from './command';
import { Dependencies } from './dependencies';
import { platform } from './base';

export class Plugin {

  private ctx: any;

  path: string;

  desc: string;

  dep: Dependencies;

  command: Command;

  autoUpdate: boolean = true;

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

  constructor(ctx: any, pluginPath: string, config: any) {
    if (!platform) {
      throw `current operating system [${platform}] is not supported`;
    }
    this.ctx = ctx;
    this.path = pluginPath;
    this.desc = config['desc'];
    this.dep = new Dependencies(config?.dep);
    this.command = new Command(this.ctx, this.path, config?.command);
    this.autoUpdate = config['auto-update'] || false;
    this.test = new Command(this.ctx, this.path, config?.test);
    this.preInstall = new Command(this.ctx, this.path, config?.['pre-install']);
    this.postInstall = new Command(
      this.ctx,
      this.path,
      config?.['post-install']
    );
    this.preRun = new Command(this.ctx, this.path, config?.['pre-run']);
    this.postRun = new Command(this.ctx, this.path, config?.['post-run']);
    this.preUpgrade = new Command(this.ctx, this.path, config?.['pre-upgrade']);
    this.postUpgrade = new Command(
      this.ctx,
      this.path,
      config?.['post-upgrade']
    );
    this.preUninstall = new Command(this.ctx, this.path, config?.['pre-uninstall']);
    this.postUninstall = new Command(this.ctx, this.path, config?.['post-uninstall']);
    this.usage = config?.['usage'];
  }

  async check() {
    await this.dep.check();
    this.command.check();
  }
}
