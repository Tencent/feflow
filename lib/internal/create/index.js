'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('create', 'active a subgenerator.', {}, require('./create'));
};