'use strict';

const fs = require('hexo-fs');
const inquirer = require('inquirer');
const Promise = require('bluebird');
const utils = require('../utils');

/**
 * Init feflow client, including ~/.feflow, ~/.feflow/package.json, ~/.feflow/.feflowrc.yml
 */
class Client {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  initHome() {
    const ctx = this.ctx;
    const {baseDir, log} = ctx;

    return new Promise(function (resolve) {
      if (fs.existsSync(baseDir) && fs.statSync(baseDir).isFile()) {
        fs.unlinkSync(baseDir);
      }

      if (!fs.existsSync(baseDir)) {
        fs.mkdirsSync(baseDir);
      }

      log.debug('.feflow 目录已经创建');
      resolve(ctx);
    });
  }

  initPkg() {
    const ctx = this.ctx;
    const {pkgPath, log} = ctx;

    return new Promise(function (resolve) {
      if (!fs.existsSync(pkgPath)) {
        fs.writeFileSync(pkgPath, JSON.stringify({
          "name": "feflow-home",
          "version": "0.0.0",
          "private": true
        }, null, 4));
      }

      log.debug('.feflow/package.json 文件已经创建');
      resolve(ctx);
    });
  }

  initLocalRc() {
    const ctx = this.ctx;
    const {rcPath, config, log} = ctx;

    return new Promise(function (resolve) {
      if (!fs.existsSync(rcPath) || !config || !config.registry) {
        inquirer.prompt([{
          type: 'input',
          name: 'registry',
          message: '请输入npm的registry:',
          default: 'http://registry.npmjs.org'
        }, {
          type: 'input',
          name: 'proxy',
          message: '请输入npm的proxy(默认为空):'
        }]).then((answer) => {
          utils.safeDump(answer, rcPath);
          log.debug('.feflow/.feflowrc.yml 配置文件已经创建');

          resolve(ctx);
        });
      } else {
        log.debug('.feflow/.feflowrc.yml 配置文件已经创建');
        resolve(ctx);
      }
    });
  }
}


module.exports = function (ctx) {
  const client = new Client(ctx);

  return Promise.all([
    client.initHome(),
    client.initPkg(),
    client.initLocalRc()
  ]);
};
