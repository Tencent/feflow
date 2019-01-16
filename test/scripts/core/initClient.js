'use strict';

const should = require('chai').should();
const initClient = require('../../../lib/core/initClient');
const path = require('path');
const logger = require('../../../lib/core/logger');
const fs = require('hexo-fs');
const sinon = require('sinon');
const inquirer = require('inquirer');

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
  logDir: path.resolve(__dirname, './feflow-container/logDir'),
  pkgPath: path.resolve(__dirname, './feflow-container/container/package.json'),
  rcPath: path.resolve(__dirname, './feflow-container/rcPath/rcPath'),
  log: logger({
    debug: Boolean(true),
    silent: Boolean(false)
  })
}

describe('initClient', () => {
  let hook;

  beforeEach(() => {
    this.sandbox = sinon.createSandbox();
    // runs before each test in this block
    hook = captureStream(process.stderr);
  });
  afterEach(() => {
    // runs after each test in this block
    hook.unhook();
    this.sandbox.restore();
  });
  it('initClient has none and need input info', () => {
    initClient(feflow)
      .then(_ => {
        fs.unlinkSync(feflow.rcPath);
      });
  });

  it('initClient has none', () => {
    this.sandbox.stub(inquirer, 'prompt').returns(Promise.resolve(['http://registry.npmjs.org', '']));
    this.sandbox.stub(process, 'exit').returns(Promise.resolve());
    initClient(feflow);
  });

  it('initClient has all', () => {
    feflow.baseDir = path.resolve(__dirname, './feflow-container/container/package.json');
    feflow.config = {
      registry: 'http://registry.npmjs.org'
    };
    initClient(feflow);
    fs.rmdirSync(feflow.logDir);
    fs.unlinkSync(feflow.pkgPath);
    fs.unlinkSync(feflow.rcPath);
  });
})