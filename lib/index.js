'use strict';

const feflow = require('./core');
const minimist = require('minimist');

function entry(args) {

  args =  minimist(process.argv.slice(2));

  console.log(args);

  return feflow.init().then(function() {
    let cmd = '';

    if (!args.h && !args.help) {
      cmd = args._.shift();

      if (cmd) {
        let c = feflow.cmd.get(cmd);
        if (!c) cmd = 'help';
      } else {
        cmd = 'help';
      }
    } else {
      cmd = 'help';
    }

    return feflow.call(cmd, args).then(function() {
      console.log('cmd', cmd);
      console.log('args', args);
    }).catch(function(err) {
      console.log(err);
    });
  });
}

module.exports = entry;