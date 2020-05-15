import {
  getRegistryUrl,
  install
} from '../../shared/npm';
import packageJson from '../../shared/packageJson';

module.exports = (ctx: any) => {
    const packageManager = ctx.config && ctx.config.packageManager;
    ctx.commander.register('install', 'Install a devkit or plugin', async () => {
      const registryUrl = await getRegistryUrl(packageManager);
      const dependencies = ctx.args['_'];

      await Promise.all(
        dependencies.map((dependency: string) => {
          return packageJson(dependency, registryUrl)
            .catch((err) => {
              ctx.logger.error(`${ dependency } not found on ${ packageManager }`);
              ctx.logger.debug(`Install Error detail msg: ${ err }`);
              process.exit(2);
            });
        })
      );

      ctx.logger.info('Installing packages. This might take a couple of minutes.');

      return install(
        packageManager,
        ctx.root,
        packageManager === 'yarn' ? 'add' : 'install',
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
        packageManager === 'yarn' ? 'remove' : 'uninstall',
        dependencies,
        false,
        true
      ).then(() => {
        ctx.logger.info('uninstall success');
      });
    });
};