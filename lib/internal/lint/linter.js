'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const Loading = require('../../utils/index').Loading;

class Linter {

  constructor(ctx) {
    this.ctx = ctx;
  }

  init(args) {
    const nodePath = path.resolve(__dirname, '../../../node_modules');
    const rootPath = process.cwd();
    const target = args.length ? [path.resolve(rootPath, args[0])] : [rootPath];

    const child = spawn(path.resolve(nodePath, '.bin/eslint'), target, { stdio: 'inherit' });
    const loading = new Loading('linting');

    child.on('close', (code) => {
      if (!code) {
        loading.success('lint complete');
      } else {
        loading.fail(`code get errors or warnings`);
      }
    });
  }
}

module.exports = function (args, b, c, d) {
  const linter = new Linter(this);

  return linter.init(args['_']);
};
