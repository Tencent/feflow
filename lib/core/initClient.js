'use strict';

const fs = require('hexo-fs');
const Promise = require('bluebird');

/**
 * Init feflow client, including ~/.feflow, ~/.feflow/package.json, ~/.feflow/.feflowrc.yml
 */
class Client {

  constructor(ctx) {
    this.ctx = ctx;
  }

  initHome() {
    const ctx = this.ctx;
    const baseDir = ctx.baseDir;

    return new Promise(function(resolve) {
        if (fs.existsSync(baseDir) && fs.statSync(baseDir).isFile()) {
            fs.unlinkSync(baseDir);
        }

        if (!fs.existsSync(baseDir)) {
            fs.mkdirsSync(baseDir);
        }
        resolve(ctx);
    });
  }

  initPkg() {
    const ctx = this.ctx;
    const pkgPath = ctx.pkgPath;

    return new Promise(function(resolve) {
        if (!fs.existsSync(pkgPath)) {
            fs.writeFileSync(pkgPath, JSON.stringify({
                "name": "feflow-home",
                "version": "0.0.0",
                "private": true
            }, null, 4));
        }
        resolve(ctx);
    });
  }

  initLocalRc() {
    const ctx = this.ctx;
    const rcPath = ctx.rcPath;

    return new Promise(function(resolve) {
        if (!fs.existsSync(rcPath)) {
          console.log('rc file not exists');
        }
        resolve(ctx);
    });
  }
}


module.exports = function(ctx) {
  const client = new Client(ctx);

  return Promise.each([
    client.initHome(),
    client.initPkg(),
    client.initLocalRc()
  ]);
};
