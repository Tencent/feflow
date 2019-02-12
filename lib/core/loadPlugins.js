'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const chalk = require('chalk');

/**
 * Read external plugins from local package.json
 */
class Plugin {

  constructor(ctx) {
    this.ctx = ctx;
  }

  /**
   * Load external plugins and then load them to memory.
   *
   * @returns {Array}
   */
  loadModules() {
    const ctx = this.ctx;
    const pluginDir = ctx.pluginDir;

    return this.loadModuleList(ctx).map(function (name) {
      let path = require.resolve(pathFn.join(pluginDir, name));

      // Load plugins
      return ctx.loadPlugin(path).then(function () {
        ctx.log.debug('Plugin loaded: %s', chalk.magenta(name));
      }).catch(function (err) {
        ctx.log.error({err: err}, 'Plugin load failed: %s', chalk.magenta(name));
      });
    });
  }

  /**
   * Read plugins from local file system which should starts with feflow-plugin-*
   */
  loadModuleList() {
    const ctx = this.ctx;
    const packagePath = pathFn.join(ctx.baseDir, 'package.json');
    const pluginDir = ctx.pluginDir;
    const extend = function (target, source) {
      for (var obj in source) {
        target[obj] = source[obj];
      }
      return target;
    };

    // Make sure package.json exists
    return fs.exists(packagePath).then(function (exist) {
      if (!exist) return [];

      // Read package.json and find dependencies
      return fs.readFile(packagePath).then(function (content) {
        const json = JSON.parse(content);
        const deps = extend(json.dependencies || {}, json.devDependencies || {});

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
}

module.exports = function (ctx) {
  const plugin = new Plugin(ctx);

  return Promise.all([
    plugin.loadModules()
  ]);
};
