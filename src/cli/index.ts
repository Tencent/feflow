import chalk from 'chalk';
import Feflow from '../core';
import figlet from 'figlet';
import minimist from 'minimist';
import semver from 'semver';
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

    console.log(chalk.cyan(data));
    console.log(chalk.cyan(` Feflow，当前版本v${pkg.version}, 让开发工作流程更简单，主页: https://github.com/Tencent/feflow             `));
    console.log(chalk.cyan(' (c) powered by Tencent.                                                                              '));
    console.log(chalk.cyan(' Run feflow --help to see usage.                                                                      '));
  });
}

export default function entry() {
  const args = minimist(process.argv.slice(2));

  const requiredVersion = pkg.engines.node;
  checkNodeVersion(requiredVersion, 'feflow-cli');

  const feflow = new Feflow(args);
  const { commander, logger } = feflow;

  return feflow.init().then(() => {
    let cmd: any = '';
    if (args.v || args.version) {
      console.log(chalk.green(pkg.version));
      return;
    } else if (!args.h && !args.help) {
      cmd = args._.shift();
      if (cmd) {
        let c = commander.get(cmd);
        if (!c) {
          cmd = 'help';
        }
      } else {
        printBanner();
        return;
      }
    } else {
      cmd = 'help';
    }

    return feflow.call(cmd, args).then(() => {
      logger.debug(`call ${cmd} success`);
    }).catch((err) => {
      handleError(err);
    });
  });
}
