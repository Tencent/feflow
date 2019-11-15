import chalk from 'chalk';
import Feflow from '../core';
import figlet from 'figlet';
import minimist from 'minimist';
import semver from 'semver';
const pkg: Package = require('../../package.json');

const checkNodeVersion = (wanted: string, id: string) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ));
    process.exit(1);
  }
}

const handleError = (err: Error) => {
  if (err) {
    console.log(chalk.red(err.message));
  }
  process.exit(2);
}

const printBanner = () => {
  figlet.text('feflow', {
    font: '3D-ASCII',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function (err, data: string | undefined) {
    if (err) {
      handleError(err);
    }

    console.log(chalk.green(data as string));
    console.log(chalk.green(` Feflow，current version: v${pkg.version}, homepage: https://github.com/Tencent/feflow             `));
    console.log(chalk.green(' (c) powered by Tencent, aims to improve front end workflow.                                       '));
    console.log(chalk.green(' Run feflow --help to see usage.                                                                   '));
  });
}

export default function entry() {
  const args: Argrments = minimist(process.argv.slice(2)) as Argrments;

  const requiredVersion = pkg.engines.node;
  checkNodeVersion(requiredVersion, '@feflow/cli');

  const feflow = new Feflow(args);
  const { commander, logger } = feflow;

  if (args.v || args.version) {
    console.log(chalk.green(pkg.version));
    return;
  }

  let cmd = args._.shift();

  if (!cmd) {
    printBanner();
    return;
  }

  return feflow.init(cmd).then(() => {
    if (!args.h && !args.help) {
      if (cmd) {
        const c = commander.get(cmd);
        if (!c) {
          cmd = 'help';
        }
      }
    } else {
      cmd = 'help';
    }

    return feflow.call(cmd as string, feflow).then(() => {
      logger.debug(`call ${cmd} success`);
    }).catch((err) => {
      handleError(err);
    });
  });
}
