import Commander from './commander';
import fs from 'fs';
import logger from './logger';
import osenv from 'osenv';
import path from 'path';
import { applyPlugin, loadPlugin } from './plugin';
import { loadDevKit } from './devkit';
import { FEFLOW_ROOT } from '../shared/constant';

const pkg = require('../../package.json');

export default class Feflow {

  public args: any;
  public version: string;
  public logger: any;
  public commander: any;
  public root: any;
  public rootPkg: any;

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

  init() {
    require('./client')(this);
    require('./native/install')(this);

    return loadPlugin(this).then((plugins: any) => {
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
