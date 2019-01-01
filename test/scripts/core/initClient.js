'use strict';

const should = require('chai').should();
const initClient = require('../../../lib/core/initClient');
const path = require('path');
const logger = require('../../../lib/core/logger');
const fs = require('hexo-fs');

function captureStream(stream) {
  let oldWrite = stream.write;
  let buf = '';
  stream.write = function (chunk, encoding, callback) {
    buf += chunk.toString(); // chunk is a String or Buffer
    oldWrite.apply(stream, arguments);
  };

  return {
    unhook: function unhook() {
      stream.write = oldWrite;
    },
    captured: function () {
      return buf;
    }
  };
}
const feflow = {
  pluginDir: path.resolve(__dirname, './plugins/demo1'),
  baseDir: path.resolve(__dirname, './feflow-container/baseDir'),
  pkgPath: path.resolve(__dirname, './feflow-container/container/package.json'),
  logDir: path.resolve(__dirname, './feflow-container/logDir'),
  rcPath: path.resolve(__dirname, './feflow-container/rcPath'),
  log: logger({
    debug: Boolean(true),
    silent: Boolean(false)
  }),
  config: {
    registry: 'http://registry.npmjs.org'
  }
}

describe('initClient', () => {
  let hook;

  beforeEach(function () {
    // runs before each test in this block
    hook = captureStream(process.stderr);
  })
  afterEach(function () {
    // runs after each test in this block
    hook.unhook();
  })
  
  it('initClient has none', () => {
    initClient(feflow);
  })
  
  it('initClient has all', () => {
    feflow.baseDir = path.resolve(__dirname, './feflow-container/container/package.json');
    feflow.rcPath = path.resolve(__dirname, './feflow-container/.feflowrc.yml');
    initClient(feflow);
  })
})