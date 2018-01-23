'use strict';

const utils = require('../../utils');

class Config {
  constructor(ctx) {
    this.ctx = ctx;
  }

  get(key) {
    const config = this.ctx.config;

    return config[key];
  }

  set(key, value) {
    const { config, rcPath } = this.ctx;
    config[key] = value;

    return utils.safeDump(config, rcPath);
  }

  list() {
    const config = this.ctx.config;

    let str = '';
    for (let prop in config) {
      str += prop + ' = ' + config[prop] + '\n';
    }

    return str.replace(/\s+$/g, '');
  }
}

module.exports = function (args) {
  const config = new Config(this);

  const cmd = args['_'].shift();
  const params = args['_'];
  const key = params[0];

  let ret;

  if (cmd === 'get' && key) {
    ret = config.get(key);
    console.log(ret);
    return 0;
  } else if (cmd === 'set' && key) {
    const value = params[1] ? params[1] : '';
    return config.set(key, value);
  } else if (cmd === 'list') {
    ret = config.list();
    console.log(ret);
    return 0;
  }
};