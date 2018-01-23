'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('install', 'Install a plugin or a yeoman generator.', {}, require('./plugin').install);

  cmd.register('uninstall', 'Uninstall a plugin or a yeoman generator', {}, require('./plugin').uninstall);
};