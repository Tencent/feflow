'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const semver = require('semver');
const spawn = require('cross-spawn');
const Table = require('easy-table');
const Config = require('./config');
const { pkgJson, Loading } = require('../../utils/index');

class Deployer {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  runBuild(cmd) {
    const self = this;
    const { log, pluginDir, baseDir } = this.ctx;
    const type = Config.getDeployerType();
    const path = pathFn.join(pluginDir, type);

    if (!fs.existsSync(path)) {
      log.info(`检测到您本地没有安装${type}部署器, 即将为您安装...`);
      const loading = new Loading(`正在安装${type}，请稍等`);
      return this.execNpmCommand('install', type, false, baseDir).then(function (result) {
        if (!result.code) {
          loading.success();
          log.info(`${type} 部署器安装完成, 即将执行构建命令...`);
          require(path)(cmd, self.ctx);
        } else {
          const err = `${type} 部署器安装失败，失败码为${result.code}，错误日志为${result.data}`;
          loading.fail(err);
          log.error(err);
        }
      });
    } else {
      return this.checkUpdate().then(() => {
        require(path)(cmd, self.ctx);
      });
    }
  }

  checkUpdate() {
    const self = this;
    const { config, log, args, baseDir } = this.ctx;
    const registry = config && config.registry;

    log.debug('正在检查部署器更新...');

    if (args.disableCheck) {
      log.debug('用户禁用了cli deployer的更新检查');
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
        log.info('检测到您本地的部分部署器需要更新才能继续使用，将采取增量更新策略');
        this.modifyDepsVersion(this.ctx.pkgPath, pluginArr);
        console.log(table.toString());
        const needUpdatePlugins = [];
        pluginArr.map((obj) => {
          needUpdatePlugins.push(obj.plugin);
        });
        const loading = new Loading('正在增量更新部署器，请稍等');
        return self.execNpmCommand('install', needUpdatePlugins, false, baseDir).then(function (result) {
          if (!result.code) {
            loading.success();
            log.info(`部署器增量更新完成`);
          } else {
            const err = `部署器增量更新失败，失败码为${result.code}，错误日志为${result.data}`;
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
      if (!/^deployer-|^@[^/]+\/deployer-/.test(name)) return false;

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
}

exports.deploy = function (args) {
  const deployer = new Deployer(this);
  const cmd = 'deploy';
  return deployer.runBuild(cmd);
};

exports.default = Deployer;