'use strict';

module.exports = function (ctx) {
  const cmd = ctx.cmd;
  cmd.register('eject', 'Eject configuation to local project.', {}, require('./eject'));
};