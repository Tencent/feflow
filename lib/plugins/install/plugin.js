'use strict';

const pathFn = require('path');
const Promise = require('bluebird');
const fs = require('hexo-fs');
const rp = require('request-promise');
const Table = require('easy-table');
const Loading = require('../../utils/index').Loading;
const spawnCommand = require('../../utils/index').spawnCommand;

class Plugin {

  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Install one or many plugins.
   * @param plugins {Array}  plugin arrays
   */
  install(plugins) {
    const self = this;
    const baseDir = this.ctx.baseDir;
    const log = this.ctx.log;
    return this.checkUpdate(plugins).then(function (result) {
      if (!result) {
        log.info('检测到您本地安装的已经是最新的插件，无需重复安装');
      } else {
        const { diffPlugins, output } = result;
        console.log(output);

        const loading = new Loading(diffPlugins);
        return self.execNpmCommand('install', diffPlugins, baseDir).then(function (result) {
          if (!result.code) {
            loading.success();
            log.info('插件安装成功');
          } else {
            const err = `插件安装失败，失败码为${result.code}，错误日志为${result.data}`;
            loading.fail(err);
            log.error(err);
          }
        });
      }
    });
  }

  /**
   * Install one or many plugins.
   * @param plugins {Array}  plugin arrays
   */
  uninstall(plugins) {
    const baseDir = this.ctx.baseDir;
    return this.execNpmCommand('uninstall', plugins, baseDir);
  }

  /**
   * Call npm command
   * @param cmd      {string}     npm command name, eg: install, uninstall
   * @param modules  {Array}      args params
   * @param where
   *
   * return code 0 means success, 1 means failure
   */
  execNpmCommand(cmd, modules, where) {
    return new Promise((resolve, reject) => {
      const args = [cmd].concat(modules).concat('--color=always');
      const tnpm = spawnCommand('tnpm', args, {cwd: where});

      let output = '';
      tnpm.stdout.on('data', (data) => {
        output += data;
      }).pipe(process.stdout);

      tnpm.stderr.on('data', (data) => {
        output += data;
      }).pipe(process.stderr);

      tnpm.on('close', (code) => {
        if (!code) {
          resolve({cod: 0, data: output});
        } else {
          reject({code: code, data: output});
        }
      });
    });
  }

  checkUpdate(plugins) {
    const self = this;
    const pluginDir = this.ctx.pluginDir;
    // Ignore plugins whose name is not started with "feflow-plugin-" or "generator-"
    plugins = plugins.filter(function(name) {
      if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-|^generator-|^@[^/]+\/generator-/.test(name)) return false;

      // Make sure the plugin exists
      const path = pathFn.join(pluginDir, name);
      return fs.exists(path);
    });

    let localVersions;
    return Promise
            .all(this.getLocal(plugins))
            .then(function (versions) {

              localVersions = versions;
              return Promise.all(self.getLts(plugins));

            }).then(function (ltsVersions) {
              const table = new Table();
              const diffPlugins = [];

              plugins.map(function (name, index) {
                const localVersion = localVersions[index];
                const ltsVersion = ltsVersions[index];
                if (localVersion !== ltsVersion) {
                  diffPlugins.push(name);
                }

                table.cell('Name', name);
                table.cell('Version', localVersion === ltsVersion ? localVersion : localVersion + ' -> ' + ltsVersion);
                table.cell('Tag', 'latest');
                table.cell('Update', localVersion === ltsVersion ? 'N' : 'Y');

                table.newRow();
              });

              return new Promise(function (resolve, reject) {
                if (diffPlugins.length) {
                  resolve({diffPlugins: diffPlugins, output: table.toString()});
                } else {
                  resolve(0);
                }
              });
            });
  }


  /**
   * Get installed plugins.
   * @param plugins
   * @returns {Array|*}
   */
  getLocal(plugins) {
    const pluginDir = this.ctx.pluginDir;
    return plugins.map(function (name) {
      const path = pathFn.join(pluginDir, name, 'package.json');
      return fs.exists(path).then(function(exist) {
        if (!exist) return;

        return fs.readFile(path).then(function(content) {
          const pkg = JSON.parse(content);
          return pkg.version;
        });
      });
    });
  }

  /**
  * Get remote latest version.
  * @param plugins
  * @returns {Array|*}
   */
  getLts(plugins) {
    return plugins.map(function (name) {
      return new Promise(function (resolve, reject) {
        const options = {
          url: `http://r.tnpm.oa.com/${name}/latest`,
          method: 'GET'
        };

        rp(options)
          .then(function (response) {
            response = JSON.parse(response);
            resolve(response && response.version);
          })
          .catch((err) => {
            resolve({err: err && err.message});
          });
      });
    });
  }
}

exports.install = function (args) {
  const plugin = new Plugin(this);
  return plugin.install(args['_']);
};

exports.uninstall = function (args) {
  const plugin = new Plugin(this);
  return plugin.uninstall(args['_']);
};
