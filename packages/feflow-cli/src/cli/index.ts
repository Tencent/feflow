import chalk from 'chalk';
import Feflow from '../core';
import figlet from 'figlet';
import minimist from 'minimist';
import semver from 'semver';
import {
  HOOK_TYPE_BEFORE,
  HOOK_TYPE_AFTER,
  EVENT_COMMAND_BEGIN
} from '../shared/constant';
const pkg = require('../../package.json');

const checkNodeVersion = (wanted: any, id: string) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        'You are using Node ' +
          process.version +
          ', but this version of ' +
          id +
          ' requires Node ' +
          wanted +
          '.\nPlease upgrade your Node version.'
      )
    );
    process.exit(1);
  }
};

const handleError = (err: any) => {
  process.exit(err?.status || 2);
};

const printBanner = () => {
  figlet.text(
    'feflow',
    {
      font: '3D-ASCII',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    },
    function (err, data: any) {
      if (err) {
        handleError(err);
      }

      console.log(chalk.green(data));
      console.log(
        chalk.green(
          ` Feflow，current version: v${pkg.version}, homepage: https://github.com/Tencent/feflow             `
        )
      );
      console.log(
        chalk.green(
          ' (c) powered by Tencent, aims to improve front end workflow.                                       '
        )
      );
      console.log(
        chalk.green(
          ' Run fef --help to see usage.                                                                      '
        )
      );
    }
  );
};

export default function entry() {
  const args = minimist(process.argv.slice(2));

  const requiredVersion = pkg.engines.node;
  checkNodeVersion(requiredVersion, '@feflow/cli');

  const feflow = new Feflow(args);
  const { commander, logger } = feflow;
  let cmd: any = args._.shift();

  if (!cmd && (args.v || args.version)) {
    feflow.reporter.report('version', args);
    console.log(chalk.green(pkg.version));
    return;
  }

  if (!cmd && !args.h && !args.help) {
    printBanner();
    return;
  }

  return feflow.init(cmd).then(() => {
    const isInvalidCmd = !(cmd && (args.h || args.help));
    if (!args.h && !args.help) {
      if (cmd) {
        const c = commander.get(cmd);
        if (!c) {
          cmd = 'help';
        }
      }
    } else if (isInvalidCmd) {
      cmd = 'help';
    }

    feflow.cmd = cmd;

    feflow.hook.emit(HOOK_TYPE_BEFORE);

    feflow.hook.on(EVENT_COMMAND_BEGIN, () => {
      return feflow
        .call(cmd, feflow)
        .then(() => {
          feflow.hook.emit(HOOK_TYPE_AFTER);
          logger.debug(`call ${cmd} success`);
        })
        .catch((err) => {
          handleError(err);
        });
    });
  });
}
