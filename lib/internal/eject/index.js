'use strict';

module.exports = function (ctx) {
    const cmd = ctx.cmd;
    cmd.register('eject', 'eject configuation to local project.', {}, require('./eject'));
}