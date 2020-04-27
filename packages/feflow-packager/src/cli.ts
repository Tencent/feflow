import chalk from 'chalk';
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

export default function entry() {
  const args = minimist(process.argv.slice(2));

  const requiredVersion = pkg.engines.node;
  checkNodeVersion(requiredVersion, '@feflow/packager');

  let cmd: any = args._.shift();

  console.log('cmd', cmd);
}