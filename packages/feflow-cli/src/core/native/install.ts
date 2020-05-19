import { getRegistryUrl, install } from '../../shared/npm';
import execa from 'execa';
import fs from 'fs';
import path from 'path';
import rp from 'request-promise';
import packageJson from '../../shared/packageJson';
import {
  getLtsTag,
  checkoutVersion
} from '../../shared/npm';
import { parseYaml } from '../../shared/yaml';
import {
  UNIVERSAL_MODULES,
  UNIVERSAL_PKG_JSON,
  UNIVERSAL_PLUGIN_CONFIG,
} from '../../shared/constant';
import { Plugin } from '../schema/plugin';
import Linker from '../linker';

function download(url: string, filepath: string): Promise<any> {
  return execa('git', ['clone', url, filepath], {
    stdio: 'inherit'
  });
}

function writeDependencies(plugin: string, ltsTag: string, universalPkgJsonPath: string) {
  if (!fs.existsSync(universalPkgJsonPath)) {
    fs.writeFileSync(universalPkgJsonPath, JSON.stringify({
        'name': 'universal-home',
        'version': '0.0.0',
        'dependencies': {}
    }, null, 2));
  }

  const universalPkgJson = require(universalPkgJsonPath);
  universalPkgJson.dependencies[plugin] = ltsTag;
  fs.writeFileSync(universalPkgJsonPath, JSON.stringify(universalPkgJson, null, 4));
}

function resolvePlugin(ctx: any, repoPath: string): Plugin {
    const pluginFile = path.join(repoPath, UNIVERSAL_PLUGIN_CONFIG);
    const exists = fs.existsSync(pluginFile);
    if (!exists) {
        throw `the ${UNIVERSAL_PLUGIN_CONFIG} file was not found`;
    }
    let config;
    try {
        config = parseYaml(pluginFile);
    } catch(e) {
        throw `the ${UNIVERSAL_PLUGIN_CONFIG} file failed to resolve, please check the syntax, e: ${e}`;
    }
    return new Plugin(ctx, repoPath, config)
}

function getRepoInfo(serverUrl: string, packageName: string): any {
  return new Promise((resolve, reject) => {
    const options = {
      url: `${serverUrl}apply/getlist?name=${ packageName }`,
      method: 'GET'
    };

    rp(options)
      .then((response: any) => {
        const data = JSON.parse(response);
        resolve(data.data[0]);
      })
      .catch((err: object) => {
        reject(err);
      });
  });
}

module.exports = (ctx: any) => {
    const packageManager = ctx.config && ctx.config.packageManager;
    const serverUrl = ctx.config && ctx.config.serverUrl;
    const universalModules = path.join(ctx.root, UNIVERSAL_MODULES);
    const universalPkgJsonPath = path.join(ctx.root, UNIVERSAL_PKG_JSON);

    ctx.commander.register('install', 'Install a devkit or plugin', async () => {
      const registryUrl = await getRegistryUrl(packageManager);
      const dependencies = ctx.args['_'];
      let repoInfo: any = {};
      if (serverUrl) {
        repoInfo = await getRepoInfo(serverUrl, dependencies[0]);
      }
      const repoUrl = (repoInfo && repoInfo.repo) || dependencies[0];
      if (/(.git)/.test(repoUrl)) {
        const ltsTag = await getLtsTag(repoUrl);
        ctx.logger.debug('Latest tag version:', ltsTag);
        const match = repoUrl.match(/\/([a-zA-Z0-9\-_]*).git$/);
        const command = match && match[1];
        let repoName: string;
        ctx.logger.debug(`Repo name is: ${ command }`);
        if (/^feflow-plugin/.test(command)) {
            repoName = `${ command }`;
        } else {
            repoName = `feflow-plugin-${ command }`;
        }
        const repoPath = path.join(universalModules, `${repoName}@${ltsTag}`);
        if (!fs.existsSync(repoPath)) {
          ctx.logger.info(`Start download from ${ repoUrl }`);
          await download(repoUrl, repoPath);
          ctx.logger.info(`Switch to version ${ ltsTag}`);
          await checkoutVersion(repoPath, ltsTag);
          ctx.logger.debug('Write package to universal-package.json');

          const plugin = resolvePlugin(ctx, repoPath);
          await plugin.check();
          ctx.logger.debug('check plugin success');

          plugin.preInstall.run();
          new Linker().register(ctx.bin, ctx.lib, command);

          writeDependencies(repoName, ltsTag, universalPkgJsonPath);
          plugin.test.run();
          plugin.postInstall.run([], (out: string, err?: any): boolean => {
              out && console.log(out);
              return err ? false : true;
          });

          ctx.logger.info('install success');
        } else {
          ctx.logger.info(`${ repoName } has already be installed`);
        }
      } else {
        await Promise.all(
          dependencies.map((dependency: string) => {
            return packageJson(dependency, registryUrl)
              .catch((err) => {
                ctx.logger.error(`${ dependency } not found on ${ packageManager }`);
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