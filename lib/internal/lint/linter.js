'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const Loading = require('../../utils/index').Loading;

class Linter {

  constructor(ctx) {
    this.ctx = ctx;
  }

  init(args = [], ignores = []) {
    const nodePath = path.resolve(__dirname, '../../../node_modules');
    const rootPath = process.cwd();
    const target = args.length ? args.map(arg => path.resolve(rootPath, arg)) : [rootPath];

    const lintIgnores = [];
    ignores.forEach(ignore => {
      lintIgnores.push('--ignore-pattern');
      lintIgnores.push(ignore);
    });

    const child = spawn(
      path.resolve(nodePath, '.bin/eslint'),
      ['--ignore-pattern', 'node_modules', ...lintIgnores, ...target],
      { stdio: 'inherit' }
    );
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

module.exports = function (args) {
  const linter = new Linter(this);
  let { _, ignore } = args;

  if (ignore) {
    ignore = Array.isArray(ignore) ? ignore : [ignore];
  }

  return linter.init(_, ignore);
};
