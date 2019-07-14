import chalk from 'chalk';
import spawn from 'cross-spawn';

const install = (root: any, cmd: any, dependencies: any, verbose: boolean, isOnline: boolean) => {
  return new Promise((resolve, reject) => {
    const command = 'npm';
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
    ctx.commander.register('install', 'Install a devkit or plugin', () => {
      const dependencies = ctx.args['_'];
      console.log('Installing packages. This might take a couple of minutes.');

      return install(
        ctx.root,
        'install',
        dependencies,
        false,
        true
      ).then(() => {
        console.log('install success');
      });
    });

    ctx.commander.register('uninstall', 'Install a devkit or plugin', () => {
      const dependencies = ctx.args['_'];
      console.log('Uninstalling packages. This might take a couple of minutes.');

      return install(
        ctx.root,
        'uninstall',
        dependencies,
        false,
        true
      ).then(() => {
        console.log('uninstall success');
      });
    });
};