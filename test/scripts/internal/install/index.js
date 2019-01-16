'use strict';

const should = require('chai').should();
const expect = require('chai').expect;
const fs = require('hexo-fs');
const _ = require('lodash');
const pathFn = require('path');
const sinon = require('sinon');
const osenv = require('osenv');
const sep = pathFn.sep;
// const {install, uninstall} = require('../../../../lib/internal/install/plugin');
// const logger = require('../../../../lib/core/logger');

describe('internal intall', () => {
  beforeEach(function() {

  });

  afterEach(function() {

  });

  it('internal install()', () => {
    // this.ctx = {
    //   baseDir: pathFn.resolve(__dirname, '../../core/plugins/feflow-plugin-demo1'),
    //   log: logger({
    //     debug: Boolean(true),
    //     silent: Boolean(false)
    //   })
    // };
    // install({
    //   '_': 'feflow-plugin-demo1'
    // });
  });

  it('uninstall()', () => {

  });
});
