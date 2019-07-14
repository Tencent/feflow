import Commander from './commander';
import Config from './config';
import fs from 'fs';
import logger from './logger';
import osenv from 'osenv';
import path from 'path';
import { applyPlugin, loadPlugin } from './plugin';
import { loadDevKit } from './devkit';

const pkg = require('../../package.json');

export default class Feflow {

  public version: string;
  public logger: any;
  public commander: any;

  constructor(args: any) {
    args = args || {};
    this.version = pkg.version;
    this.commander = new Commander();
    this.logger = logger({
      debug: Boolean(args.debug),
      silent: Boolean(args.silent)
    });
  }

  init() {
    return loadPlugin().then((plugins) => {
      applyPlugin(plugins)(this);
    });
    // }).then(() => {
    //   const config = new Config();
    //   const configData = config.loadConfig();
    //   loadDevKit(configData)(this);
    //   console.log('init success');
    // });
  }

  call(name: any, args: any) {
    return new Promise<any>((resolve, reject) => {
      const cmd = this.commander.get(name);
      if (cmd) {
        cmd.call(this, args);
      } else {
        reject(new Error('Command `' + name + '` has not been registered yet!'));
      }
    });
  }
}
