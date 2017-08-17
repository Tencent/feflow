'use strict';

module.exports = function(ctx) {

  const cmd = ctx.cmd;

  cmd.register('install', 'Install a plugin or a yeoman generator.', {}, require('./install_plugins'));
};