import Commander from './commander';
import fs from 'fs';
import bunyan from 'bunyan';
import logger from './logger';
import osenv from 'osenv';
import path from 'path';
import { applyPlugin, loadPlugin } from './plugin';
import { loadDevKit } from './devkit';
import { FEFLOW_ROOT } from '../shared/constant';

const pkg = require('../../package.json');


export interface Args {
  [propName: string]: string;
}

export default class Feflow {

  public args: Args;
  public logger: bunyan;
  public commander: Commander;
  public version: string;
  public root: string;
  public rootPkg: string;

  constructor(args: any) {
    args = args || {};
    const root = path.join(osenv.home(), FEFLOW_ROOT);
    this.root = root;
    this.rootPkg = path.join(root, 'package.json');
    this.args = args;
    this.version = pkg.version;
    this.commander = new Commander();
    this.logger = logger({
      debug: Boolean(args.debug),
      silent: Boolean(args.silent)
    });
  }

  async init() {
    require('./client')(this);
    require('./native/generator')(this);
    require('./native/install')(this);

    const plugins = await loadPlugin(this);
    applyPlugin(plugins)(this);

    await loadDevKit();
  }

  call(name: any, args: Args) {
    return new Promise<never>((resolve, reject) => {
      const cmd = this.commander.get(name);
      if (cmd) {
        cmd.call(this, args);
      } else {
        reject(new Error('Command `' + name + '` has not been registered yet!'));
      }
    });
  }
}
