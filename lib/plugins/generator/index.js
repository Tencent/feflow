'use strict';

module.exports = function(ctx) {

  const cmd = ctx.cmd;

  cmd.register('init', 'Choose a scaffold to initialize project.', {}, require('./generator'));
};