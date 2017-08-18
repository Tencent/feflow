'use strict';

const Promise = require('bluebird');
const spawnCommand = require('../../utils/index').spawnCommand;

class Plugin {

  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Install one or many plugins.
   * @param plugins {Array}  plugin arrays
   */
  install(plugins) {
    const baseDir = this.ctx.baseDir;
    return this._execNpmCommand('install', plugins, baseDir);
  }

  /**
   * Install one or many plugins.
   * @param plugins {Array}  plugin arrays
   */
  uninstall(plugins) {
    const baseDir = this.ctx.baseDir;
    return this._execNpmCommand('uninstall', plugins, baseDir);
  }

  /**
   * Call npm command
   * @param cmd      {string}     npm command name, eg: install, uninstall
   * @param modules  {Array}      args params
   * @param where
   * @private
   *
   * return code 0 means success, 1 means failure
   */
  _execNpmCommand(cmd, modules, where) {
    return new Promise((resolve, reject) => {
      const args = [cmd].concat(modules).concat('--color=always');
      const tnpm = spawnCommand('tnpm', args, {cwd: where});

      let output = '';
      tnpm.stdout.on('data', (data) => {
        output += data;
      }).pipe(process.stdout);

      tnpm.stderr.on('data', (data) => {
        output += data;
      }).pipe(process.stderr);

      tnpm.on('close', (code) => {
        if (!code) {
          resolve({cod: 0, data: output});
        } else {
          reject({code: code, data: output});
        }
      });
    });
  }
}

const plugin = new Plugin(this);

exports.install = function (args) {
  return plugin.install(args['_']);
};

exports.uninstall = function (args) {
  return plugin.uninstall(args['_']);
};