'use strict';

const pathFn = require('path');
const chalk = require('chalk');
const Table = require('easy-table');
const fs = require('hexo-fs');
const Promise = require('bluebird');

/**
 * Install one or many plugins.
 * @param plugins {Array}  plugin arrays
 * @param ctx {Object} context environment
 */
function installModules(plugins, ctx) {
  if (typeof plugins === 'string') {
    plugins = [plugins];
  }

  const pkgPath = ctx.pkgPath;
  const pluginDir = ctx.pluginDir;

  const table = new Table();

  // Ignore plugins whose name is not started with "feflow-plugin-" or "generator-"
  plugins = plugins.filter(function(name) {
    if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-|^generator-|^@[^/]+\/generator-/.test(name)) return false;

    // Make sure the plugin exists
    const path = pathFn.join(pluginDir, name);
    return fs.exists(path);
  });

  Promise.all(data).then((ret) => {
    console.log(ret)
  });

}

/**
 * Get local packages version
* @param plugins {Array}  plugin arrays
 */
function localVersions(plugins) {
  return plugins.map(function (name) {
    const path = pathFn.join(pluginDir, name, 'package.json');
    return readPkg(path);
  });
}

/**
 * Get remote packages latest version
* @param plugins {Array}  plugin arrays
 */
function remoteVersions(plugins) {
  return plugins.map(function (name) {
    return fetchRegistry(name);
  });
}

function readPkg(path) {
  return fs.exists(path).then(function(exist) {
    if (!exist) return;

    return fs.readFile(path).then(function(content) {
      const pkg = JSON.parse(content);
      return pkg.version;
    });
  });
}


function fetchRegistry(plugins) {

  return new Promise(function (resolve, reject) {

  });
}

module.exports = function (args) {
  const ctx = this;

  return installModules(args['_'], ctx);
};
