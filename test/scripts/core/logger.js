'use strict';

const should = require('chai').should();
const logger = require('../../../lib/core/logger');

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
describe('Logger some info', () => {
  let hook;

  beforeEach(function () {
    // runs before each test in this block
    hook = captureStream(process.stderr);
  })
  afterEach(function () {
    // runs after each test in this block
    hook.unhook();
  })

  it('test debug and silent', () => {
    const log = logger({
      debug: true,
      silent: true
    });
    log.debug('hello feflow');
  })
  it('test no debug and silent', () => {
    const log = logger({})
    log.info('hello feflow')
  })
  it('test debug', () => {
    const log = logger({
      debug: true,
      silent: false
    });
    log.debug('hello feflow');
  })
  it('test warn', () => {
    const log = logger({
      debug: true,
      silent: false
    });
    log.warn('hello feflow');
  })
  it('test error', () => {
    const log = logger({
      debug: true,
      silent: false
    });
    log.error('hello feflow');
  })
})