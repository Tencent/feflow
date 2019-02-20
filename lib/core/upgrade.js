'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const chalk = require('chalk');
const semver = require('semver');
const Table = require('easy-table');
const spawn = require('cross-spawn');

const { 
  pkgJson,
  Loading,
  isUndef
} = require('../utils/index');
const pkg = require('../../package.json');

class Upgrade {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  checkCore() {
    const self = this;
    const { config, log, args } = this.ctx;
    const registry = config && config.registry;

    log.debug('正在检查cli core更新...');

    if (args.disableCheck) {
      log.debug('用户禁用了cli core的更新检查');
      return;
    }

    return pkgJson('feflow-cli', 'latest', registry).then(json => {
      const version = pkg.version;
      const configs = json.configs;
      const ltsVersion = json.version;
      const compatibleVersion = configs && configs.compatibleVersion;
      log.debug(`本地版本:  ${version}, 兼容版本 ${compatibleVersion}`);

      // If local installed felfow version not compatible with remote, it will be force update to latest version.
      if (!semver.satisfies(version, compatibleVersion)) {
        log.info(`您当前使用的feflow版本 ${version}, feflow要求使用的版本为 ${compatibleVersion}, 将会使用全量更新策略`);

        const loading = new Loading('正在全量更新cli core，请稍等');
        return self.execNpmCommand('install', 'feflow-cli', true).then(function (result) {
          if (!result.code) {
            loading.success();
            log.info(`已经自动升级到feflow的最新版本${ltsVersion}`);
          } else {
            const err = `cli core全量更新失败，${isUndef(result.code) ? '' : '失败码为' + result.code}，错误日志如下：\n${result.data}`;
            loading.fail();
            log.error(err);
          }
        }, function (error) {
          const err = `cli core全量更新失败，${isUndef(error.code) ? '' : '失败码为' + error.code}，错误日志如下：\n${error.data}`;
          loading.fail();
          log.error(err);
        });
      } else {
        log.debug(`当前安装的版本 ${version} 和最新版本 ${ltsVersion} 兼容`);
      }
      return false;
    });
  }

  checkPlugin() {
    const self = this;
    const { config, log, baseDir } = this.ctx;
    const registry = config && config.registry;

    log.debug('正在检查cli plugin更新...');

    const table = new Table();
    return this.getInstalledPlugins().map((plugin) => {
      return this.getLocal(plugin).then((version) => {
        return pkgJson(plugin, 'latest', registry).then((json) => {
          const configs = json.configs;
          const ltsVersion = json.version;
          const compatibleVersion = configs && configs.compatibleVersion;
          if (compatibleVersion && !semver.satisfies(version, compatibleVersion)) {
            table.cell('Name', plugin);
            table.cell('Version', version === ltsVersion ? version : version + ' -> ' + ltsVersion);
            table.cell('Tag', 'latest');
            table.cell('Update', version === ltsVersion ? 'N' : 'Y');
            table.newRow();

            return { plugin, ltsVersion };
          }
        });
      });
    }).filter((obj) => {
      return obj && !!obj.plugin;
    }).then((pluginArr) => {
      if (pluginArr.length) {
        log.info('检测到您本地的部分插件需要更新才能继续使用，将采取 cli plugin 增量更新策略');
        this.modifyDepsVersion(this.ctx.pkgPath, pluginArr);
        console.log(table.toString());
        const needUpdatePlugins = [];
        pluginArr.map((obj) => {
          needUpdatePlugins.push(obj.plugin);
        });
        const loading = new Loading('正在增量更新cli plugin，请稍等');
        return self.execNpmCommand('install', needUpdatePlugins, false, baseDir).then(function (result) {
          if (!result.code) {
            loading.success();
            log.info(`cli plugin 增量更新完成`);
          } else {
            const err = `cli plugin 增量更新失败，失败码为${result.code}，错误日志为${result.data}`;
            loading.fail(err);
            log.error(err);
          }
        });
      }
    });
  }

  /**
   * Modify local package.json dependencies version, otherwise npm will not install success
   */
  modifyDepsVersion(packagePath, arr) {
    const obj = require(packagePath);

    arr.map((item) => {
      obj.dependencies[item.plugin] = item.ltsVersion;
    });

    fs.writeFileSync(packagePath, JSON.stringify(obj, null, 4));
  }

  getInstalledPlugins() {
    const ctx = this.ctx;
    const packagePath = pathFn.join(ctx.baseDir, 'package.json');
    const pluginDir = ctx.pluginDir;

    // Make sure package.json exists
    return fs.exists(packagePath).then(function (exist) {
      if (!exist) return [];

      // Read package.json and find dependencies
      return fs.readFile(packagePath).then(function (content) {
        const json = JSON.parse(content);
        const deps = json.dependencies || json.devDependencies || {};

        return Object.keys(deps);
      });
    }).filter(function (name) {
      // Ignore plugins whose name is not started with "feflow-plugin-"
      if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) return false;

      // Make sure the plugin exists
      const path = pathFn.join(pluginDir, name);
      return fs.exists(path);
    });
  }

  getLocal(name) {
    const pluginDir = this.ctx.pluginDir;
    const path = pathFn.join(pluginDir, name, 'package.json');
    return fs.exists(path).then(function (exist) {
      if (!exist) return;

      return fs.readFile(path).then(function (content) {
        const pkg = JSON.parse(content);
        return pkg.version;
      });
    });
  }

  execNpmCommand(cmd, modules, isGlobal, where) {
    const {registry, proxy} = this.ctx.config;
    const log = this.ctx.log;
    const failedTimeout = 60 * 1000;

    return new Promise((resolve, reject) => {
      let args = [cmd].concat(modules).concat('--color=always').concat('--save');
      let failedTimer;

      if (isGlobal) {
        args = args.concat('-g');
      }
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

      npm.on('close', (code, signal) => {
        clearTimeout(failedTimer);
        if(signal) {
          output = chalk.red(`  Command timeout!  `);
        }
        if (code === 0) {
          resolve({code: 0, data: output});
        } else {
          reject({code: code, data: output});
        }
      });

      failedTimer = setTimeout(() => {
        npm.kill();
      }, failedTimeout);
    });
  }
}

module.exports = function (ctx) {
  const upgrade = new Upgrade(ctx);

  return Promise.all([
    upgrade.checkCore(),
    upgrade.checkPlugin()
  ]);
};
