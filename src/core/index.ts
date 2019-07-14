import Commander from './commander';
import Config from './devkit/config';
import fs from 'fs';
import logger from './logger';
import osenv from 'osenv';
import path from 'path';
import { applyPlugin, loadPlugin } from './plugin';
import { loadDevKit } from './devkit';

const pkg = require('../../package.json');

export default class Feflow {

  public args: any;
  public version: string;
  public logger: any;
  public commander: any;
  public root: any;

  constructor(args: any) {
    args = args || {};
    this.root = path.join(osenv.home(), '.feflow');
    this.args = args;
    this.version = pkg.version;
    this.commander = new Commander();
    this.logger = logger({
      debug: Boolean(args.debug),
      silent: Boolean(args.silent)
    });
  }

  init() {
    require('./native/install')(this);

    return loadPlugin().then((plugins) => {
      applyPlugin(plugins)(this);
    }).then(() => {
      loadDevKit()(this);
    });
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
