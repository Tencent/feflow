'use strict';

const vm = require('vm');
const pathFn = require('path');
const Module = require('module');
const osenv = require('osenv');
const Promise = require('bluebird');
const chalk = require('chalk');
const fs = require('hexo-fs');
const { camelizeKeys } = require('humps');
const logger = require('./logger');
const Command = require('./command');
const utils = require('../utils');
const { Loading } = require('../utils');
const pkg = require('../../package.json');
const sep = pathFn.sep;

/**
 * A command line tool aims to improve front-end engineer workflow.
 *
 */
class Feflow {

  /**
   * Set root and plugin path, context variable include log, cli command object.
   * @param args
   */
  constructor(args) {
    args = args || {};

    const base = pathFn.join(osenv.home(), './.feflow');
    const rcPath = pathFn.join(base, '.feflowrc.yml');

    this.version = pkg.version;
    this.baseDir = base + sep;
    this.rcPath = rcPath;
    this.pkgPath = pathFn.join(base, 'package.json');
    this.pluginDir = pathFn.join(base, 'node_modules') + sep;
    this.logDir = pathFn.join(base, 'logs');

    this.config = utils.parseYaml(rcPath);            // Read feflow local config.

    this.log = logger({
      debug: Boolean(args.debug),
      silent: Boolean(args.silent)
    });

    // Bug: https://github.com/Tencent/feflow/issues/107
    this.args = camelizeKeys(args);
    // Can use origin arguments.
    this.rawArgs = args;

    this.cmd = new Command();

    // Pass useful functions through feflow context to generator, builer and plugins
    this.utils = {
      chalk: chalk,
      Loading: Loading
    };
  }

  /**
   * Read config and load internal and external plugins.
   */
  init() {
    const self = this;

    this.log.debug('Feflow version: %s', chalk.magenta(this.version));

    // Load internal plugins
    require('../internal/console')(this);
    require('../internal/config')(this);
    require('../internal/generator')(this);
    require('../internal/install')(this);
    require('../internal/build')(this);
    require('../internal/lint')(this);
    require('../internal/eject')(this);
    require('../internal/deploy')(this);
    require('../internal/clean')(this);
    require('../internal/create')(this);

    // Init client and load external plugins
    return Promise.each([
      'initClient',
      'upgrade',
      'loadPlugins'
    ], function (name) {
      return require('./' + name)(self);
    }).then(function () {
      // Init success
      self.log.debug('init success!');
    });

  }

  /**
   * Call a command in console.
   * @param name
   * @param args
   * @param callback
   */
  call(name, args, callback) {
    if (!callback && typeof args === 'function') {
      callback = args;
      args = {};
    }

    const self = this;

    return new Promise(function (resolve, reject) {
      const c = self.cmd.get(name);

      if (c) {
        c.call(self, args).then(resolve, reject);
      } else {
        reject(new Error('Command `' + name + '` has not been registered yet!'));
      }
    }).asCallback(callback);
  }

  /**
   * Load a plugin with vm module and inject feflow variable,
   * feflow is an instance and has context environment.
   *
   * @param path      {String}    Plugin path
   * @param callback  {Function}  Callback
   */
  loadPlugin(path, callback) {
    const self = this;

    return fs.readFile(path).then((script) => {

      const module = new Module(path);
      module.filename = path;
      module.paths = Module._nodeModulePaths(path);

      function require(path) {
        return module.require(path);
      }

      require.resolve = function (request) {
        return Module._resolveFilename(request, module);
      };

      require.main = process.mainModule;
      require.extensions = Module._extensions;
      require.cache = Module._cache;

      // Inject feflow variable
      script = '(function(exports, require, module, __filename, __dirname, feflow){' +
        script + '});';

      const fn = vm.runInThisContext(script, path);

      return fn(module.exports, require, module, path, pathFn.dirname(path), self);
    }).asCallback(callback);
  }

}

module.exports = Feflow;
