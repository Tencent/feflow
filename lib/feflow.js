'use strict';

const minimist = require('minimist');
const figlet = require('figlet');
const semver = require('semver');
const chalk = require('chalk');
const Feflow = require('./core');
const pkg = require('../package.json');

/**
 * Entrance file, parse user input and call a command.
 *
 * @param args
 * @returns {Promise.<T>}
 */
function entry(args) {
  args = minimist(process.argv.slice(2));

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
    }, function (err, data) {
      if (err) {
        log.info('Something went wrong...');
        log.error(err);
        return;
      }

      console.log(chalk.cyan(data));
      console.log(chalk.cyan(` Feflow，当前版本v${feflow.version}, 让开发工作流程更简单，主页: https://github.com/cpselvis/feflow-cli      `));
      console.log(chalk.cyan(' (c) powered by IVWEB Team                                                                            '));
      console.log(chalk.cyan(' Run feflow --help to see usage.                                                                      '));
    });
  }

  log.debug('process.version', process.version);
  log.debug('pkg.engines.node', pkg.engines.node);

  if (!semver.satisfies(process.version, pkg.engines.node)) {
    return log.error(`运行feflow所需Node.js版本为${pkg.engines.node}，当前版本为${process.version}，请升级到最新版本Node.js(https://nodejs.org/en/).`);
  }

  return feflow.init().then(function () {
    // outer command
    let cmd = args._.shift();

    // if don't have outer command, maybe have -v or -h arguments.
    if (!cmd) {
      if (args.v || args.version) {
        return console.log(`v${feflow.version}`);
      } else if (args.h || args.help) {
        cmd = 'help';
      } else {
        return printBanner();
      }
    }

    // if command is not registering, replace to 'help' command.
    if (!feflow.cmd.get(cmd)) {
      cmd = 'help';
    }

    return feflow.call(cmd, args).then(function () {

    }).catch(function (err) {
      console.log(err);
    });
  }).catch(handleError);
}

module.exports = entry;