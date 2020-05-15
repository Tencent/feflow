import {
  getRegistryUrl,
  install
} from '../../shared/npm';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import {
  UNIVERSAL_MODULES,
  UNIVERSAL_PKG_JSON
} from '../../shared/constant';
import packageJson from '../../shared/packageJson';

async function download(url: string, filepath: string): Promise<any> {
  return execa('git', ['clone', url, filepath], {
    stdio: 'inherit'
  });
}

async function writeDependencies(plugin: string, universalPkgJsonPath: string) {
  if (!fs.existsSync(universalPkgJsonPath)) {
    fs.writeFileSync(universalPkgJsonPath, JSON.stringify({
        'name': 'universal-home',
        'version': '0.0.0',
        'dependencies': {}
    }, null, 2));
  }

  const universalPkgJson = require(universalPkgJsonPath);
  universalPkgJson.dependencies[plugin] = '0.0.0';
  fs.writeFileSync(universalPkgJsonPath, JSON.stringify(universalPkgJson, null, 4));
}

module.exports = (ctx: any) => {
    const packageManager = ctx.config && ctx.config.packageManager;
    const universalModules = path.join(ctx.root, UNIVERSAL_MODULES);
    const universalPkgJsonPath = path.join(ctx.root, UNIVERSAL_PKG_JSON);

    ctx.commander.register('install', 'Install a devkit or plugin', async () => {
      const registryUrl = await getRegistryUrl(packageManager);
      const dependencies = ctx.args['_'];

      if (/(.git)/.test(dependencies[0])) {
        const repoUrl = dependencies[0];
        const match = repoUrl.match(/\/([a-zA-Z0-9]*).git$/);
        let repoName = match && match[1];
        ctx.logger.debug(`Repo name is: ${ repoName }`);
        if (!/^feflow-plugin/.test(repoName)) {
          repoName = `feflow-plugin-${ repoName }`;
        }
        const repoPath = path.join(universalModules, repoName);
        if (!fs.existsSync(repoPath)) {
          ctx.logger.info(`Start download from ${ repoUrl }`);
          await download(repoUrl, repoPath);
        }
        ctx.logger.debug('Write package to universal-package.json');
        await writeDependencies(repoName, universalPkgJsonPath);
      } else {
        await Promise.all(
          dependencies.map((dependency: string) => {
            return packageJson(dependency, registryUrl)
              .catch(() => {
                ctx.logger.error(`${ dependency } not found on ${ packageManager }`);
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
      }
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