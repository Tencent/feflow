'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('lint', 'Lint you project use eslint-config-ivweb.', {}, require('./linter'));
};
