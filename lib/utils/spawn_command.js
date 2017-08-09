'use strict';

const spawn = require('child_process').spawn;

module.exports = function (command, args, options) {
  const win32 = process.platform === 'win32';

  const winCommand = win32 ? 'cmd' : command;

  const winArgs = win32 ? ['/c'].concat(command, args) : args;

  return spawn(winCommand, winArgs, options);
};