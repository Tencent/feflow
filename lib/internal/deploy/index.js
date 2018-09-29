'use strict';

module.exports = function (ctx) {

  const cmd = ctx.cmd;

  cmd.register('deploy', 'Deploy files', {}, require('./deployer').deploy);
};
