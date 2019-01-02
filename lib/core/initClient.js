'use strict';

const fs = require('hexo-fs');
const inquirer = require('inquirer');
const Promise = require('bluebird');
const utils = require('../utils');
const DEFAULTNPMREGEISTRY = 'http://registry.npmjs.org';
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
        log.info('检测到这是您第一次使用feflow，即将进行cli client初始化');

        fs.ensurePathSync(baseDir);
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
    const self = this;

    const ctx = this.ctx;
    const {rcPath, config, log} = ctx;

    const npmConfig = this.getNpmConfig();
    const {proxy, registry} = npmConfig;

    return new Promise(function (resolve) {
      if (!fs.existsSync(rcPath) || !config || !config.registry) {
        // 第一次初始化 且 命令行携带 --registry 信息就可以通过命令行直接完成初始化 并不阻塞 后续流程
        if(registry) {
          self.setFeflowYml(npmConfig);
          resolve(ctx);
        } else {
         inquirer.prompt([{
          type: 'input',
          name: 'registry',
          message: '请输入npm的registry:',
          default: DEFAULTNPMREGEISTRY
        }, {
          type: 'input',
          name: 'proxy',
          message: '请输入npm的proxy(默认为空):'
        }]).then((answer) => {
            self.setFeflowYml(answer);
            process.exit(2);
            resolve(ctx);
        });
        }
       
      } else {
        log.debug('.feflow/.feflowrc.yml 配置文件已经创建');
        resolve(ctx);
      }
    });
  }

  initLogs() {
    const ctx = this.ctx;
    const {logDir, log} = ctx;
    return new Promise(function (resolve) {
      if (!fs.existsSync(logDir)) {
        fs.mkdirsSync(logDir);
      }
      log.debug('.feflow/logs 日志文件夹已经创建');
      resolve(ctx);
    });
  }

  getNpmConfig() {
    const {args} = this.ctx;
    if(args.registry || args.proxy || args.init) {
      return {
        registry: args.init ? DEFAULTNPMREGEISTRY : (args.registry || ''),
        proxy: args.proxy || ''
      };
    };
    // 默认值
    return {};
  }

  setFeflowYml(npmConfig){
    const {rcPath, config, log} = this.ctx;
    // Handle user input, trim space
    for (let prop in npmConfig) {
      npmConfig[prop] = npmConfig[prop].trim();
    }
    // Modify oldConfig 
    this.ctx.config = npmConfig;
    // Save user config to local file system
    utils.safeDump(npmConfig, rcPath);

    log.debug('.feflow/.feflowrc.yml 配置文件已经创建');

    log.info('初始化完成，请输入命令开启feflow的使用之旅。(帮助：feflow -h)');
  }

}


module.exports = function (ctx) {
  const client = new Client(ctx);

  return Promise.all([
    client.initHome(),
    client.initPkg(),
    client.initLocalRc(),
    client.initLogs()
  ]);
};
