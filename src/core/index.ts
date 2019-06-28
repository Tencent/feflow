import Commander from './commander';
import Config from './config';
import fs from 'fs';
import logger from './logger';
import osenv from 'osenv';
import path from 'path';
import { applyPlugins, loadPlugins } from '../plugin';
import { loadDevKit } from '../devkit';

const pkg = require('../package.json');

export default class Feflow {

  private version: string;
  private logger: any;
  private commander: any;

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
    return loadPlugins().then((plugins) => {
      applyPlugins(plugins)(this);
    }).then(() => {
      const config = new Config();
      const configData = config.loadConfig();
      loadDevKit(configData)(this);
      console.log('init success');
    });
  }

  call(name: any, args: any) {
    return new Promise<any>((resolve, reject) => {
      const cmd = this.commander.get(name);
      if (cmd) {
        cmd.call(this, args).then(resolve, reject);
      } else {
        reject(new Error('Command `' + name + '` has not been registered yet!'));
      }
    });
  }
}
