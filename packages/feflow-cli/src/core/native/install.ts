import { install } from '../../shared/npm';

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