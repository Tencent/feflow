import { getRegistryUrl, install } from '../../shared/npm';
import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import rp from 'request-promise';
import packageJson from '../../shared/packageJson';
import {
    getTag,
  checkoutVersion
} from '../../shared/npm';
import { parseYaml } from '../../shared/yaml';
import {
  UNIVERSAL_MODULES,
  UNIVERSAL_PKG_JSON,
  UNIVERSAL_PLUGIN_CONFIG,
  LATEST_VERSION
} from '../../shared/constant';
import { Plugin } from '../schema/plugin';
import Linker from '../linker';

async function download(url: string, filepath: string): Promise<any> {
  return spawn.sync('git', ['clone', url, filepath], {
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

function removeDependencies(plugin: string, ltsTag: string, universalPkgJsonPath: string) {
  if (!fs.existsSync(universalPkgJsonPath)) {
    fs.writeFileSync(universalPkgJsonPath, JSON.stringify({
        'name': 'universal-home',
        'version': '0.0.0',
        'dependencies': {}
    }, null, 2));
  }

  const universalPkgJson = require(universalPkgJsonPath);
  delete universalPkgJson.dependencies[plugin];
  fs.writeFileSync(universalPkgJsonPath, JSON.stringify(universalPkgJson, null, 4));
}

function removeSyslink(binPath: string) {
  if (fs.existsSync(binPath) && fs.statSync(binPath).isFile()) {
      fs.unlinkSync(binPath);
  }
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

function deleteDir(dirPath: string) {
  let files: any = [];
  if(fs.existsSync(dirPath)) {
    files = fs.readdirSync(dirPath);
    files.forEach((file: string, index: number) =>{
      const curPath = dirPath + '/' + file;
      if(fs.statSync(curPath).isDirectory()) {
        deleteDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
};

module.exports = (ctx: any) => {
    const packageManager = ctx.config && ctx.config.packageManager;
    const serverUrl = ctx.config && ctx.config.serverUrl;

    ctx.commander.register('install', 'Install a devkit or plugin', async () => {
      const registryUrl = await getRegistryUrl(packageManager);
      const dependencies = ctx.args['_'];
      const installPluginStr = dependencies[0];
      if (!installPluginStr) {
        throw 'parameter error';
      }
      const [installPkg, version] = installPluginStr.split('@');
      if (version && !/^v\d+.\d+.\d+$/i.test(version)) {
        throw `unrecognized version: ${version}`;
      }
      let repoInfo: any = {};
      if (serverUrl) {
        repoInfo = await getRepoInfo(serverUrl, installPkg);
      } else {
        throw 'the server url is not configured';
      }
      const repoUrl = repoInfo?.repo;
      if (/(.git)/.test(repoUrl) && !(repoInfo?.tnpm)) {
        try {
          return installUniversalPlugin(ctx, repoInfo?.name, repoUrl, version);
        } catch (ex) {
          ctx.logger.error(ex);
          return;
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

    ctx.commander.register('uninstall', 'Uninstall a devkit or plugin', async () => {
      const dependencies = ctx.args['_'];
      ctx.logger.info('Uninstalling packages. This might take a couple of minutes.');

      const installPluginStr = dependencies[0];
      if (!installPluginStr) {
        throw 'parameter error';
      }
      const [installPkg, version] = installPluginStr.split('@');
      if (version && !/^v\d+.\d+.\d+$/i.test(version)) {
        throw `unrecognized version: ${version}`;
      }
      let repoInfo: any = {};
      if (serverUrl) {
        repoInfo = await getRepoInfo(serverUrl, installPkg);
      } else {
        throw 'the server url is not configured';
      }
      const repoUrl = repoInfo?.repo;

      if (/(.git)/.test(repoUrl) && !(repoInfo?.tnpm)) {
        try {
          return uninstallUniversalPlugin(ctx, repoInfo?.name, repoUrl);
        } catch (ex) {
          ctx.logger.error(ex);
          return;
        }
      } else {
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
      }
    });
};

async function installUniversalPlugin(ctx: any, repoName: string, repoUrl: string, version?: string) {
    const universalModules = path.join(ctx.root, UNIVERSAL_MODULES);
    const universalPkgJsonPath = path.join(ctx.root, UNIVERSAL_PKG_JSON);
    version && await getTag(repoUrl, version);
    const installVersion = version || LATEST_VERSION;
    const checkoutTag = version || await getTag(repoUrl);
    ctx.logger.debug('install version:', checkoutTag);
    const repoPath = path.join(universalModules, `${repoName}@${installVersion}`);
    if (!fs.existsSync(repoPath)) {
        ctx.logger.info(`Start download from ${ repoUrl }`);
        await download(repoUrl, repoPath);
    }
    ctx.logger.info(`Switch to version ${ installVersion}`);
    await checkoutVersion(repoPath, checkoutTag);
    ctx.logger.debug('Write package to universal-package.json');

    const plugin = resolvePlugin(ctx, repoPath);
    // check the validity of the plugin before installing it
    await plugin.check();
    ctx.logger.debug('check plugin success');

    plugin.preInstall.run();
    new Linker().register(ctx.bin, ctx.lib, repoName.replace('feflow-plugin-', ''));

    writeDependencies(repoName, installVersion, universalPkgJsonPath);
    plugin.test.run();
    plugin.postInstall.run();

    ctx.logger.info('install success');
}

async function uninstallUniversalPlugin(ctx: any, repoName: string, repoUrl: string) {
  const universalModules = path.join(ctx.root, UNIVERSAL_MODULES);
  const universalPkgJsonPath = path.join(ctx.root, UNIVERSAL_PKG_JSON);
  const universalPkgJson = require(universalPkgJsonPath);
  const version = universalPkgJson.dependencies[repoName];
  const repoPath = path.join(universalModules, `${repoName}@${version}`);
  if (fs.existsSync(repoPath)) {
    deleteDir(repoPath);
    removeDependencies(repoName, version, universalPkgJsonPath);
    const binPath = path.join(ctx.bin, repoName.replace('feflow-plugin-', ''));
    removeSyslink(binPath);
    ctx.logger.info('uninstall success');
  } else {
    ctx.logger.info('You have not installed this package');
  }
}

module.exports.installUniversalPlugin = installUniversalPlugin;
module.exports.getRepoInfo = getRepoInfo;