'use strict';

const semver = require('semver');
const spawn = require('cross-spawn');
const { pkgJson, Loading } = require('../utils/index');
const pkg = require('../../package.json');

class Upgrade {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  check() {
    const self = this;
    const { config, log } = this.ctx;
    const registry = config && config.registry;

    log.debug('正在检查更新...');
    pkgJson('feflow-cli', 'latest', registry).then(json => {
      const version = pkg.version;
      //const compatibleVersion = json.configs && json.configs.compatiableVersion;
      const compatibleVersion = '>=0.10.0';
      // If local installed felfow version not compatible with remote, it will be force update to latest version.
      if (!semver.satisfies(version, compatibleVersion)) {
        log.info(`您当前使用的feflow版本 ${version}, feflow要求使用的版本为 ${compatibleVersion}, 将会使用全量更新策略`);

        const loading = new Loading('正在全量安装feflow-cli，请稍等');
        return self.execNpmCommand('install', 'feflow-cli').then(function (result) {
          if (!result.code) {
            loading.success();
            log.info(`已经自动升级到feflow的最新版本`);
          } else {
            const err = `feflow-cli安装失败，失败码为${result.code}，错误日志为${result.data}`;
            loading.fail(err);
            log.error(err);
          }
        });
      }
    });
  }

  execNpmCommand(cmd, modules, where) {
    const {registry, proxy} = this.ctx.config;
    const log = this.ctx.log;

    return new Promise((resolve, reject) => {
      let args = [cmd].concat(modules).concat('--color=always').concat('--save').concat('-g');
      if (registry) {
        args = args.concat(`--registry=${registry}`);
      }
      if (proxy) {
        args = args.concat(`--proxy=${proxy}`);
      }
      log.debug(args);

      const npm = spawn('npm', args, {cwd: where});

      let output = '';
      npm.stdout.on('data', (data) => {
        output += data;
      }).pipe(process.stdout);

      npm.stderr.on('data', (data) => {
        output += data;
      }).pipe(process.stderr);

      npm.on('close', (code) => {
        if (!code) {
          resolve({cod: 0, data: output});
        } else {
          reject({code: code, data: output});
        }
      });
    });
  }

  forceUpdate() {

  }
}

module.exports = function (ctx) {
  const upgrade = new Upgrade(ctx);


  return Promise.all([
    upgrade.check()
  ]);
};