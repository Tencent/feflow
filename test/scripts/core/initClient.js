'use strict';

const should = require('chai').should();
const initClient = require('../../../lib/core/initClient');
const path = require('path')
const logger = require('../../../lib/core/logger')

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
  baseDir: path.resolve(__dirname, './plugins/demo1'),
  pkgPath: path.resolve(__dirname, '../../../package.json'),
  logDir: path.resolve(__dirname, '../../logger'),
  rcPath: path.resolve(__dirname, '../../'),
  log: logger({
    debug: Boolean(true),
    silent: Boolean(false)
  })
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

  it('initClient no rcpath', () => {
    initClient(feflow)
  })
  it('initClient has rcpath', () => {
    feflow.config = {
      registry: 'http://registry.npmjs.org'
    }
    initClient(feflow)
  })
})