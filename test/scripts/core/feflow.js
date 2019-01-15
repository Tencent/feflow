'use strict';

const should = require('chai').should();
const pathFn = require('path');
const osenv = require('osenv');
const sinon = require('sinon');
const sep = pathFn.sep;


describe('Feflow', () => {
  const Feflow = require('../../../lib/core');
  const feflow = new Feflow();
  const version = require('../../../package.json').version;
  const base = pathFn.join(osenv.home(), './.feflow');

  feflow.cmd.register('test', args => args);
  it('constructor', () => {
    feflow.version.should.eql(version);
    feflow.baseDir.should.eql(base + sep);
    feflow.pkgPath.should.eql(pathFn.join(base, 'package.json'));
    feflow.pluginDir.should.eql(pathFn.join(base, 'node_modules') + sep);
  });

  it('call() - no callback and args is not a function', () => feflow.call('test', {foo: 'bar'}).then(data => {
    data.should.eql({foo: 'bar'});
  }));

  it('call() - callback without args', callback => {
    feflow.call('test', (err, data) => {
      should.not.exist(err);
      data.should.eql({});

      callback();
    });
  });

  it('call() - callback with args', callback => {
    feflow.call('test', {foo: 'bar'}, (err, data) => {
      should.not.exist(err);
      data.should.eql({foo: 'bar'});

      callback();
    });
  });

  it('call() - command not registered', () => {
    const errorCallback = sinon.spy(err => {
      err.should.have.property('message', 'Command `nothing` has not been registered yet!');
    });

    return feflow.call('nothing').catch(errorCallback).finally(() => {
      errorCallback.calledOnce.should.be.true;
    });
  });

  it('loadPlugin() - load a plugin', () => {
    feflow.loadPlugin(pathFn.resolve(__dirname, './plugins/feflow-plugin-demo1/lib/index.js'), (err) => {
      err.should.be.eql(null);
    });
  });

});
