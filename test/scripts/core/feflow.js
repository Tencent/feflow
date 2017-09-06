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

  it('constructor', () => {
    feflow.version.should.eql(version);
    feflow.baseDir.should.eql(base + sep);
    feflow.pkgPath.should.eql(pathFn.join(base, 'package.json'));
    feflow.pluginDir.should.eql(pathFn.join(base, 'node_modules') + sep);
  });

  it('call() - command not registered', () => {
    const errorCallback = sinon.spy(err => {
      err.should.have.property('message', 'Command `nothing` has not been registered yet!');
    });

    return feflow.call('nothing').catch(errorCallback).finally(() => {
      errorCallback.calledOnce.should.be.true;
    });
  });

});
