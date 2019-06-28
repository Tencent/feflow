import chalk from 'chalk';
import Feflow from './core';
import figlet from 'figlet';
import minimist from 'minimist';
import semver from 'semver';
const pkg = require('../package.json');

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

export default function entry() {
  const args = minimist(process.argv.slice(2));

  const requiredVersion = pkg.engines.node;
  checkNodeVersion(requiredVersion, 'feflow-cli');

  const feflow = new Feflow(args);

  return feflow.init().then(() => {
    let cmd: any = '';
    if (args.v || args.version) {
      console.log(chalk.green(pkg.version));
      return;
    } else {
      cmd = args._.shift();

      return feflow.call(cmd, args).then(() => {
        console.log('success!');
      }).catch((err) => {
        handleError(err);
      });
    }
  });
}
