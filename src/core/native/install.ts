import chalk from 'chalk';
import spawn from 'cross-spawn';

const install = (packageManager: string, root: any, cmd: any, dependencies: any, verbose: boolean, isOnline: boolean) => {
  return new Promise((resolve, reject) => {
    const command = packageManager;
    const args = [
        cmd,
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
    ].concat(dependencies);

    if (verbose) {
      args.push('--verbose');
    }

    const child = spawn(command, args, { stdio: 'inherit', cwd: root });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}

module.exports = (ctx: any) => {
    const packageManager = ctx.config && ctx.config.packageManager;
    ctx.commander.register('install', 'Install a devkit or plugin', () => {
      const dependencies = ctx.args['_'];
      ctx.logger.info('Installing packages. This might take a couple of minutes.');

      return install(
        packageManager,
        ctx.root,
        'install',
        dependencies,
        false,
        true
      ).then(() => {
        ctx.logger.info('install success');
      });
    });

    ctx.commander.register('uninstall', 'Uninstall a devkit or plugin', () => {
      const dependencies = ctx.args['_'];
      ctx.logger.info('Uninstalling packages. This might take a couple of minutes.');

      return install(
        packageManager,
        ctx.root,
        'uninstall',
        dependencies,
        false,
        true
      ).then(() => {
        ctx.logger.info('uninstall success');
      });
    });
};