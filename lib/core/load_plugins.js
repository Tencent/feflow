'use strict';

const pathFn = require('path');
const fs = require('hexo-fs');
const Promise = require('bluebird');
const chalk = require('chalk');

module.exports = function(ctx) {
  return Promise.all([
    loadModules(ctx)
  ]);
};

/**
 * Load external plugins and then load them to memory.
 *
 * @param ctx       {Object}   context
 * @returns {Array}
 */
function loadModules(ctx) {
  const pluginDir = ctx.pluginDir;

  return loadModuleList(ctx).map(function(name) {
    let path = require.resolve(pathFn.join(pluginDir, name));

    // Load plugins
    return ctx.loadPlugin(path).then(function() {
      ctx.log.debug('Plugin loaded: %s', chalk.magenta(name));
    }).catch(function(err) {
      ctx.log.error({err: err}, 'Plugin load failed: %s', chalk.magenta(name));
    });
  });
}

/**
 * Read plugins from local file system which should starts with feflow-plugin-*
 * @param ctx       {Object}   context
 * @returns {Array.<TResult>|*}
 */
function loadModuleList(ctx) {
  const packagePath = pathFn.join(ctx.baseDir, 'package.json');
  const pluginDir = ctx.pluginDir;

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
    // Ignore plugins whose name is not started with "feflow-plugin-"
    if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) return false;

    // Make sure the plugin exists
    const path = pathFn.join(pluginDir, name);
    return fs.exists(path);
  });
}