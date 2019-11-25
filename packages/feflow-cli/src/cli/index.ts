import chalk from 'chalk';
import Feflow from '../core';
import figlet from 'figlet';
import minimist from 'minimist';
import semver from 'semver';
import Report from '@feflow/report';
import checkCliUpdate from './upgrade';
const pkg = require('../../package.json');

const checkNodeVersion = (wanted: any, id: string) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red(
      'You are using Node ' + process.version + ', but this version of ' + id +
      ' requires Node ' + wanted + '.\nPlease upgrade your Node version.'
    ));
    process.exit(1);
  }
}

const handleError = (err: any) => {
  if (err) {
    console.log(chalk.red(err));
  }
  process.exit(2);
}

const printBanner = () => {
  figlet.text('feflow', {
    font: '3D-ASCII',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  }, function (err, data: any) {
    if (err) {
      handleError(err);
    }

    console.log(chalk.green(data));
    console.log(chalk.green(` Feflow，current version: v${pkg.version}, homepage: https://github.com/Tencent/feflow             `));
    console.log(chalk.green(' (c) powered by Tencent, aims to improve front end workflow.                                       '));
    console.log(chalk.green(' Run feflow --help to see usage.                                                                   '));
  });
}

export default function entry() {
  const args = minimist(process.argv.slice(2));

  const requiredVersion = pkg.engines.node;
  checkNodeVersion(requiredVersion, '@feflow/cli');

  const feflow = new Feflow(args);
  const { commander, logger } = feflow;
  const report = new Report(feflow);

  if (args.v || args.version) {
      report.report('version', args);
      console.log(chalk.green(pkg.version));
      return;
  }

  let cmd: any = args._.shift();

  if (!cmd) {
      printBanner();
      return;
  }

  return feflow.init(cmd).then(async () => {
    
    await checkCliUpdate(feflow);

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

    report.report(cmd, args);

    return feflow.call(cmd, feflow).then(() => {
      logger.debug(`call ${cmd} success`);
    }).catch((err) => {
      handleError(err);
    });
  });
}
