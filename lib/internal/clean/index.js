'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('clean', 'Clean feflow folder.', {}, require('./clean'));
};
