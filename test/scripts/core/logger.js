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

  it('call() debug and silent', () => {
    const log = logger({
      debug: true,
      silent: true
    });
    log.debug(123);
    log.info(123123123)
  })
  it('call() debug', () => {
    const log = logger({
      debug: true,
      silent: false
    });
    log.debug(123);
  })
})