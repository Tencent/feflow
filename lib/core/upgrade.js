'use strict';

const pkg = require('../../package.json');
const pkgJson = require('../utils/index').pkgJson;

class Upgrade {

  constructor(ctx) {
    this.ctx = ctx;
    this.log = ctx.log;
  }

  check() {
    const { config, log } = this.ctx;
    const registry = config && config.registry;

    log.debug('正在检查更新...');
    pkgJson('feflow-cli', 'latest', registry).then(json => {
      // const configs = json.configs;
      // => {name: '@sindresorhus/df', ...}
    });
  }

  forceUpdate() {

  }
}

module.exports = function (ctx) {
  const upgrade = new Upgrade(ctx);


  return Promise.all([
    upgrade.check()
  ]);
};