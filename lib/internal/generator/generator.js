'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const semver = require('semver');
const inquirer = require('inquirer');
const spawn = require('cross-spawn');
const Table = require('easy-table');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();
const { pkgJson, Loading } = require('../../utils/index');

class Generator {

  constructor(ctx, args) {
    this.ctx = ctx;
    this.args = args;
  }

  init() {
    const self = this;
    const ctx = this.ctx;
    const log = ctx.log;
    return self.checkUpdate().then(() => {
      self.loadGeneratorList(ctx).then((generators) => {
        const options = generators.map((item) => {
          return item.desc
        });
        if (generators.length) {
          inquirer.prompt([{
            type: 'list',
            name: 'desc',
            message: '您想要创建哪种类型的工程?',
            choices: options
          }]).then((answer) => {
            let name;

            generators.map((item) => {
              if (item.desc === answer.desc) {
                name = item.name;
              }
            });

            name && self.run(name, ctx);
          });
        } else {
          log.warn(
            '检测到你还未安装任何模板，请先安装后再进行项目初始化，' +
            '参考文档：https://github.com/iv-web/feflow-cli/blob/master/README.md'
          );
        }
      });
    });
  }

  checkUpdate() {
    const self = this;
    const { config, log, baseDir, args } = this.ctx;
    const registry = config && config.registry;

    log.debug('正在检查脚手架更新...');

    if (args.disableCheck) {
      log.debug('用户禁用了cli generator的更新检查');
      return Promise.resolve();
    }

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
        log.info('检测到您本地的部分脚手架需要更新才能继续使用，将采取增量更新策略');
        this.modifyDepsVersion(this.ctx.pkgPath, pluginArr);
        console.log(table.toString());
        const needUpdatePlugins = [];
        pluginArr.map((obj) => {
          needUpdatePlugins.push(obj.plugin);
        });
        const loading = new Loading('正在增量更新脚手架，请稍等');
        return self.execNpmCommand('install', needUpdatePlugins, false, baseDir).then(function (result) {
          if (!result.code) {
            loading.success();
            log.info(`脚手架增量更新完成`);
          } else {
            const err = `脚手架增量更新失败，失败码为${result.code}，错误日志为${result.data}`;
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
      if (!/^generator-|^@[^/]+\/generator-/.test(name)) return false;

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

    return new Promise((resolve, reject) => {
      let args = [cmd].concat(modules).concat('--color=always').concat('--save');
      if (isGlobal) {
        args = args.concat('-g');
      }
      if (registry) {
        args = args.concat(`--registry=${registry}`);
      }
      if (proxy) {
        args = args.concat(`--proxy=${proxy}`);
      }
      args = args.concat('--global-style');
      args = args.concat('--unsafe-perm');

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
          resolve({code: 0, data: output});
        } else {
          reject({code: code, data: output});
        }
      });
    });
  }

  run(name) {
    const ctx = this.ctx;
    const pluginDir = ctx.pluginDir;
    let path = pathFn.join(pluginDir, name, 'app/index.js');

    if (!fs.existsSync(path)) {
      path = pathFn.join(pluginDir, name, 'generators', 'app/index.js');
    }

    yeomanEnv.register(require.resolve(path), name);
    yeomanEnv.run(name, ctx, err => {
    });
  }

  loadGeneratorList() {
    const ctx = this.ctx;
    const baseDir = ctx.baseDir;
    const pluginDir = ctx.pluginDir;
    const packagePath = pathFn.join(baseDir, 'package.json');

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
      // Find yeoman generator.
      if (!/^generator-|^@[^/]+\/generator-/.test(name)) return false;

      // Make sure the generator exists
      const path = pathFn.join(pluginDir, name);
      return fs.exists(path);
    }).map(function (name) {
      const path = pathFn.join(pluginDir, name);
      let packagePath = pathFn.join(path, 'package.json');

      // Read generator config.
      return fs.readFile(packagePath).then(function (content) {
        const json = JSON.parse(content);
        const desc = json.description;

        return {name, desc};
      });
    });
  }
}

module.exports = function (args) {
  const generator = new Generator(this, args);

  return generator.init();
};
