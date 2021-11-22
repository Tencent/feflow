import chalk from 'chalk';
import minimist from 'minimist';
import semver from 'semver';
import Packager from './index';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('../package.json');

const checkNodeVersion = (wanted: string, id: string) => {
  if (!semver.satisfies(process.version, wanted)) {
    console.log(
      chalk.red(
        `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`,
      ),
    );
    process.exit(1);
  }
};

export default function entry() {
  const args = minimist(process.argv.slice(2));

  const requiredVersion = pkg.engines.node;
  checkNodeVersion(requiredVersion, '@feflow/packager');

  const cmd = args._.shift();
  cmd && new Packager(cmd).pack();
}
