'use strict';

const osenv = require('osenv');
const pathFn = require('path');
const fs = require('hexo-fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();

class Generator {

  constructor(ctx) {
    this.ctx = ctx;
  }

  init() {
    const self = this;
    const ctx = this.ctx;
    const log = ctx.log;
    return self.loadGeneratorList(ctx).then((generators) => {
      const options = generators.map((item) => {return item.desc});
      if (generators.length) {
        inquirer.prompt([{
          type: 'list',
          name: 'desc',
          message: '您想要创建哪中类型的工程?',
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
  }

  run(name) {
    const ctx = this.ctx;
    const pluginDir = ctx.pluginDir;
    let path = pathFn.join(pluginDir, name, 'app/index.js');

    if (!fs.existsSync(path)) {
      path = pathFn.join(pluginDir, name, 'generators', 'app/index.js');
    }

    yeomanEnv.register(require.resolve(path), name);
    yeomanEnv.run(name, { 'skip-install': true }, err => {});
  }

  loadGeneratorList() {
    const ctx = this.ctx;
    const baseDir = ctx.baseDir;
    const pluginDir = ctx.pluginDir;
    const packagePath = pathFn.join(baseDir, 'package.json');

    // Make sure package.json exists
    return fs.exists(packagePath).then(function(exist) {
      if (!exist) return [];

      // Read package.json and find dependencies
      return fs.readFile(packagePath).then(function(content) {
        const json = JSON.parse(content);
        const deps = json.dependencies || json.devDependencies || {};

        return Object.keys(deps);
      });
    }).filter(function(name) {
      // Find yeoman generator.
      if (!/^generator-|^@[^/]+\/generator-/.test(name)) return false;

      // Make sure the generator exists
      const path = pathFn.join(pluginDir, name);
      return fs.exists(path);
    }).map(function(name) {
      let path = pathFn.join(pluginDir, name);
      let packagePath = pathFn.join(path, 'package.json');

      // Read generator config.
      return fs.readFile(packagePath).then(function(content) {
        const json = JSON.parse(content);
        const desc = json.description;

        return { name, desc };
      });
    });
  }
}

module.exports = function (args) {
  const generator = new Generator(this);

  return generator.init();
};
