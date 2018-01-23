'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const spawn = require('cross-spawn');
const { Loading } = require('../../utils/index');
const Config = require('./config');

class Builder {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  runBuild(cmd) {
    const { log, pluginDir, baseDir } = this.ctx;
    const type = Config.getBuilderType();
    const path = pathFn.join(pluginDir, type);

    if (!fs.existsSync(path)) {
      log.info(`检测到您本地没有安装${type}构建器, 即将为您安装...`);
      const loading = new Loading(`正在安装${type}，请稍等`);
      return this.execNpmCommand('install', type, false, baseDir).then(function (result) {
        if (!result.code) {
          loading.success();
          log.info(`${type} 构建器安装完成, 即将执行构建命令...`);
          require(path)(cmd);
        } else {
          const err = `${type} 构建器安装失败，失败码为${result.code}，错误日志为${result.data}`;
          loading.fail(err);
          log.error(err);
        }
      });
    } else {
      require(path)(cmd);
    }
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
          resolve({cod: 0, data: output});
        } else {
          reject({code: code, data: output});
        }
      });
    });
  }
}

exports.dev = function (args) {
  const builder = new Builder(this);
  const cmd = 'dev';
  return builder.runBuild(cmd);
};

exports.build = function (args) {
  const builder = new Builder(this);
  const cmd = 'build';
  return builder.runBuild(cmd);
};
