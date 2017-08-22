'use strict';

const should = require('chai').should();
const pathFn = require('path');
const osenv = require('osenv');
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
});
