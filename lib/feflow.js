'use strict';

const Feflow = require('./core');
const figlet = require('figlet');
const chalk = require('chalk');
const minimist = require('minimist');

/**
 * Entrance file, parse user input and call a command.
 *
 * @param args
 * @returns {Promise.<T>}
 */
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

  /**
   * Print banner
   * Font preview：http://patorjk.com/software/taag/#p=display&f=3D-ASCII&t=feflow%0A
   *
   */
  function printBanner() {
    figlet.text('feflow', {
      font: '3D-ASCII',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    }, function(err, data) {
      if (err) {
        log.info('Something went wrong...');
        log.error(err);
        return;
      }

      console.log(chalk.cyan(data));
      console.log(chalk.cyan(` Feflow，当前版本v${feflow.version}, 让开发工作流程更简单，主页: https://github.com/iv-web/feflow-cli      `));
      console.log(chalk.cyan(' (c) powered by IVWEB Team                                                                            '));
      console.log(chalk.cyan(' Run feflow --help to see usage.                                                                      '));
    });
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
        printBanner();
        return;
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