'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('init', 'Choose a boilerplate to initialize project.', {}, require('./generator'));
};