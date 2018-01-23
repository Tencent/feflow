'use strict';

const should = require('chai').should();
const ora = require('ora');

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

describe('Loading', () => {
  const Loading = require('../../../lib/utils/loading');
  let loading, hook;

  beforeEach(function () {
    loading = new Loading('test');
    // runs before each test in this block
    hook = captureStream(process.stderr);
  })
  afterEach(function () {
    // runs after each test in this block
    hook.unhook();
  })

  it('constructor() - no color', () => {
    loading.spinner.text.should.eql('Loading test');
    loading.spinner.color.should.eql('yellow');
  });

  it('success()', () => {
    loading.success('test')
    // hook.captured().should.eql('\u001b[2K\u001b[1G\u001b[?25h\u001b[32m✔\u001b[39m test\n');
  });

  it('fail()', () => {
    loading.fail('test')
    // hook.captured().should.eql('\u001b[2K\u001b[1G\u001b[?25h\u001b[31m✖\u001b[39m test\n');
  });
});
