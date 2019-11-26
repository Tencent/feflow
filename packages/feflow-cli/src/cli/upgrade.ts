import chalk from 'chalk';
import packageJson from '../shared/packageJson'
import { getRegistryUrl } from '../shared/npm';
import semver from 'semver';
import { safeDump } from '../shared/yaml';
import spawn from 'cross-spawn';
import inquirer from 'inquirer';

async function updateCli(packageManager: string) {
  return new Promise((resolve, reject) => {
    const args = [
      'install',
      'feflow-cli@latest',
      '--color=always',
      '--save',
      '--save-exact',
      '--loglevel',
      'error',
      '-g'
    ];

    const child = spawn(packageManager, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${packageManager} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  })
}

export default async function checkCliUpdate(ctx: any) {
  const { version, config, configPath } = ctx;
  if (config.lastUpdateCheck && (+new Date() - parseInt(config.lastUpdateCheck, 10)) <= 1000 * 3600 * 24) {
    return;
  }
  const packageManager = config.packageManager;
  const registryUrl = await getRegistryUrl(packageManager);
  const latestVersion: any = await packageJson('feflow-cli', 'latest', registryUrl)
  if (semver.gt(latestVersion, version)) {
    const askIfUpdateCli = [{
      type: "confirm",
      name: "ifUpdate",
      message: `${chalk.yellow(`feflow-cli's latest version is ${chalk.green(`${latestVersion}`)} but your version is ${chalk.red(`${version}`)}, Do your want to update it?`)}`,
      default: true
    }]
    const answer = await inquirer.prompt(askIfUpdateCli)
    if (answer.ifUpdate) {
      await updateCli(packageManager)
    } else {
      safeDump({
        ...config,
        'lastUpdateCheck': +new Date()
      }, configPath);
    }
  }
}
