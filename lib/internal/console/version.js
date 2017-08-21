'use strict';

const os = require('os');
const Promise = require('bluebird');

module.exports = function (args) {
  const versions = process.versions;
  const keys = Object.keys(versions);
  let key = '';

  console.log('feflow:', this.version);
  console.log('os:', os.type(), os.release(), os.platform(), os.arch());

  for (let i = 0, len = keys.length; i < len; i++) {
    key = keys[i];
    console.log('%s: %s', key, versions[key]);
  }

  return Promise.resolve();
};