'use strict';

const should = require('chai').should();
const pathFn = require('path');
const fs = require('hexo-fs');
const Module = require('module');
const vm = require('vm');
const abbrev = require('abbrev');
const loadPlugins = require('../../../lib/core/loadPlugins');
const logger = require('../../../lib/core/logger')
const Command = require('../../../lib/core/command')
const Promise = require('bluebird');

describe('loadPlugins', () => {
  const command = new Command();
  var feflow = {
    pluginDir: pathFn.resolve(__dirname, './plugins'),
    baseDir: pathFn.resolve(__dirname, './plugins/feflow-plugin-demo1'),
    log: logger({
      debug: Boolean(true),
      silent: Boolean(false)
    }),
    cmd: command,
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

        try{
          const fn = vm.runInThisContext(script, path);
          return fn(module.exports, require, module, path, pathFn.dirname(path), self);
        } catch(e) {
          console.log('logad error', e)
          e.should.be.eql(null);
        }

      }).asCallback(callback);
    }
  };
  it('call() load a simple plugin four args', () => {
    loadPlugins(feflow);
  });
  it('call() load a simple plugin three args', () => {
    feflow.baseDir = pathFn.resolve(__dirname, './plugins/feflow-plugin-demo2');
    loadPlugins(feflow);
  });
  it('call() load a simple plugin three args', () => {
    feflow.baseDir = pathFn.resolve(__dirname, './plugins/feflow-plugin-demo3');
    loadPlugins(feflow);
  });
  it('call() load plugin err', (done) => {
    feflow.loadPlugin = () => {
      return Promise.reject('cant find this plugin');
    }
    loadPlugins(feflow).then(_ => {
      done();
    });
  });
})