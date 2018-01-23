'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('dev', 'Local development', {}, require('./builder').dev);

  cmd.register('build', 'Build source code to a bunlde', {}, require('./builder').build);
};
