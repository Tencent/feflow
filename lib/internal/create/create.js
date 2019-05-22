'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();

class Creator {

  constructor(ctx, args) {
    this.ctx = ctx;
    this.args = args;
  }

  init() {
    const {
      args,
      pluginDir,
      log
    } = this.ctx;
    const generator = args.generator;
    const subgenerator = args[''][1];
    if (!subgenerator || !generator) {
      log.warn(
        '请输入子脚手架及脚手架名称 eg：feflow create <subgenerator> --generator <generator>'
      );
      return;
    }
    const dirPath = pathFn.join(pluginDir, generator, 'generators');
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      let selectedSub = "";
      files.forEach((filename) => {
        if (filename == subgenerator) {
          selectedSub = subgenerator
        }
      });
      if (selectedSub) {
        this.run(generator, subgenerator)
      } else {
        log.warn(
          '请确认输入了正确的子脚手架名称'
        );
      }
    } else {
      log.warn(
        '请确认输入了正确的脚手架名称'
      );
    }
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

}

module.exports = function (args) {
  const creator = new Creator(this, args);

  return creator.init();
};