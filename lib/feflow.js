'use strict';

const Feflow = require('./core');
const minimist = require('minimist');

function entry(args) {
  args =  minimist(process.argv.slice(2));

  const feflow = new Feflow(args);
  const log = feflow.log;

  function handleError(err) {
    if (err) {
      log.fatal(err);
    }

    process.exit(2);
  }

  return feflow.init().then(function() {
    let cmd = '';

    if (args.v || args.version) {
      console.log(`v${feflow.version}`);
      return;
    } else if (!args.h && !args.help) {
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

    }).catch(function(err) {
      console.log(err);
    });
  }).catch(handleError);
}

module.exports = entry;