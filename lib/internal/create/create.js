'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const semver = require('semver');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();
const inquirer = require('inquirer');
// const sep = pathFn.sep;
const utils = require('../../utils');
const chalk = require('chalk');
const spawn = require('cross-spawn');
const Table = require('easy-table');
const {
  pkgJson,
  Loading
} = require('../../utils/index');

class Creator {

  constructor(ctx, args) {
    this.ctx = ctx;
    this.args = args;
  }



  init() {
    const {
      args,
      log
    } = this.ctx;
    return this.checkUpdate().then(() => {
      this.loadGeneratorList(this.ctx).then((generators) => {
        if (generators.length) {
          const generator = args.generator;
          const subgenerator = args[''][1];
          const setGenerotor = args['setGenerator'];
          if (setGenerotor || setGenerotor === '') {
            this.setDefaultGenerator({
              defaultGenerator: setGenerotor
            });
            return;
          }
          if (generator && subgenerator) {
            this.quickStart(subgenerator, generator);
            return;
          }
          this.list(generators, subgenerator);
        } else {
          log.info(
            '检测到你还没有安装任何脚手架, 请先执行使用 feflow install <generator> 安装你需要使用的脚手架, 例如 feflow install generator-node'
          );
        }
      });
    });
  }

  quickStart(subgenerator, generator) {
    const {
      pluginDir,
      log
    } = this.ctx;
    const dirPath = pathFn.join(pluginDir, generator, 'generators');
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      let selectedSub = '';
      files.forEach((filename) => {
        if (filename == subgenerator) {
          selectedSub = subgenerator;
        }
      });
      if (selectedSub) {
        this.run(generator, subgenerator);
      } else {
        log.error(
          '请确认输入了正确的子脚手架'
        );
      }
    } else {
      log.error(
        '请确认输入了正确的脚手架'
      );
    }
  }
  quickCreate(generator, subgenerator) {
    const {
      pluginDir,
      log,
    } = this.ctx;
    // 如果已经设置 默认脚手架
    const dirPath = pathFn.join(pluginDir, generator, 'generators');
    const files = fs.readdirSync(dirPath);
    let selectedSub = '';
    files.forEach((filename) => {
      if (filename == subgenerator) {
        selectedSub = subgenerator;
      }
    });
    if (selectedSub) {
      this.run(generator, subgenerator);
    } else {
      log.warn(
        `当前默认父级脚手架为 ${generator}  ${subgenerator} 不是其子级脚手架`
      );
    }
  }
  async list(generators, subgenerator) {
    const {
      pluginDir,
      rcPath
    } = this.ctx;

    // 判断是否支持快速流程
    const config = utils.parseYaml(rcPath);
    if (config && config.defaultGenerator && subgenerator) {
      this.quickCreate(config.defaultGenerator, subgenerator);
      return;
    }

    // 正常流程
    const list = [];
    generators.forEach((generator) => {
      if (generator.name) {
        list.push({
          type: 'separator',
          line: `${chalk.green(generator.name)}`
        });
        const dirPath = pathFn.join(pluginDir, generator.name, 'generators');
        const files = fs.readdirSync(dirPath);
        files.shift();
        files.forEach(file => {
          list.push({
            name: `${file}`,
            value: `${file + ';' + generator.name}`
          });
        });
      }
    });
    const answer = await inquirer.prompt([{
      type: 'list',
      name: 'result',
      message: '请选择下列父级脚手架中的子级脚手架?',
      choices: list
    },
    {
      type: 'confirm',
      name: 'isDefault',
      message: `是否记住父级脚手架 ？ 记住后下次执行 feflow create XXX 例如： feflow create page 即可运行子级脚手架`,
      default: true
    }
    ]);
    const selectedGenerator = answer.result.split(';')[1];
    const selectedSubgenerator = answer.result.split(';')[0];
    if (answer.isDefault) {
      this.setDefaultGenerator({
        defaultGenerator: selectedGenerator
      });
    }
    this.run(selectedGenerator, selectedSubgenerator);
  }

  setDefaultGenerator(data) {
    const {
      log,
      rcPath
    } = this.ctx;
    const config = utils.parseYaml(rcPath);
    utils.safeDump({
      ...config,
      ...data
    }, rcPath);
    log.info('默认父级脚手架已更新');
  }


  run(generator, subgenerator) {
    const ctx = this.ctx;
    const pluginDir = ctx.pluginDir;
    let path = pathFn.join(pluginDir, generator, `${subgenerator}/index.js`);
    if (!fs.existsSync(path)) {
      path = pathFn.join(pluginDir, generator, 'generators', `${subgenerator}/index.js`);
    }
    yeomanEnv.register(require.resolve(path), generator);
    yeomanEnv.run(generator, this.args, err => {});
  }

  checkUpdate() {
    const self = this;
    const {
      config,
      log,
      args,
      baseDir
    } = this.ctx;
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

            return {
              plugin,
              ltsVersion
            };
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
      // Ignore plugins whose name is not started with 'feflow-plugin-'
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
    const {
      registry,
      proxy
    } = this.ctx.config;
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

      const npm = spawn('npm', args, {
        cwd: where
      });

      let output = '';
      npm.stdout.on('data', (data) => {
        output += data;
      }).pipe(process.stdout);

      npm.stderr.on('data', (data) => {
        output += data;
      }).pipe(process.stderr);

      npm.on('close', (code) => {
        if (!code) {
          resolve({
            code: 0,
            data: output
          });
        } else {
          reject({
            code: code,
            data: output
          });
        }
      });
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

        return {
          name,
          desc
        };
      });
    });
  }

}

module.exports = function (args) {
  const creator = new Creator(this, args);

  return creator.init();
};