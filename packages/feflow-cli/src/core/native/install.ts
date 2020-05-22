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
  UNIVERSAL_PLUGIN_CONFIG,
  LATEST_VERSION
} from '../../shared/constant';
import { Plugin } from '../universal-pkg/schema/plugin';
import Linker from '../universal-pkg/linker';
import { UniversalPkg } from '../universal-pkg/dep/dependencies';
import { checkVersion } from '../universal-pkg/dep/base';
import Logger from 'bunyan';

async function download(url: string, filepath: string): Promise<any> {
  return spawn.sync('git', ['clone', url, filepath], {
    stdio: 'inherit'
  });
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

async function getRepoInfo(ctx: any, packageName: string) {
  const serverUrl = ctx.config?.serverUrl
  if (!serverUrl) {
    throw 'the server url is not configured';
  } 
  const options = {
    url: `${serverUrl}apply/getlist?name=${ packageName }`,
    method: 'GET'
  };

  return rp(options)
    .then((response: any) => {
      const data = JSON.parse(response);
      return data.data && data.data[0];
    });
}

function getRepoName(repoUrl: string): string | undefined {
  const ret = /^.*\/(.*).git$/.exec(repoUrl);
  if (ret && ret.length === 2) {
    return ret[1];
  }
}

module.exports = (ctx: any) => {

    ctx.commander.register('install', 'Install a devkit or plugin', async () => {
      const dependencies = ctx.args['_'];
      const installPluginStr = dependencies[0];
      if (!installPluginStr) {
        ctx.logger.error('parameter error') ;
        return;
      }
      try {
        await installAnyPlugin(ctx, installPluginStr, true);
      } catch(e) {
        ctx.logger.error(`install error: ${e}`) ;
        process.exit(2);
      }
    });

    ctx.commander.register('uninstall', 'Uninstall a devkit or plugin', () => {
      const dependencies = ctx.args['_'];
      ctx.logger.info('Uninstalling packages. This might take a couple of minutes.');

      return install(
        ctx?.config?.packageManager,
        ctx.root,
        ctx?.config?.packageManager === 'yarn' ? 'remove' : 'uninstall',
        dependencies,
        false,
        true
      ).then(() => {
        ctx.logger.info('uninstall success');
      });
    });
};

function isGitRepo(url: string):boolean {
  return /^git@.+:.+\/.+\.git$/.test(url) || /^http(s)?:\/\/.+\/.+\/.+\.git$/.test(url);
}

async function installNpmPlugin(ctx: any, ...dependencies: string[]) {
  const packageManager = ctx?.config?.packageManager;
  const registryUrl = await getRegistryUrl(packageManager);
  await Promise.all(
    dependencies.map(async (dependency: string) => {
      try {
        return packageJson(dependency, registryUrl);
      } catch (err) {
        ctx.logger.error(`${dependency} not found on ${packageManager}`);
        ctx.logger.error(`${dependency} not found on ${packageManager}`);
        process.exit(2);
      }
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

async function installAnyPlugin(ctx: any, installPlugin: string, global: boolean) {
    const { logger, universalPkg, bin, lib }: 
    { logger: Logger, universalPkg: UniversalPkg, bin: string, lib: string } = ctx;
    const universalModules = path.join(ctx.root, UNIVERSAL_MODULES);
    const pkgInfo = await getPkgInfo(ctx, installPlugin);
    if (!pkgInfo) {
      return installNpmPlugin(ctx, ctx?.args['_']);
    }
    if (!pkgInfo.repoName) {
      throw `plugin [${pkgInfo.repoName}] does not exist`;
    }
    logger.debug('install version:', pkgInfo.checkoutTag);
    const repoPath = path.join(universalModules, `${pkgInfo.repoName}@${pkgInfo.installVersion}`);
    if (!fs.existsSync(repoPath)) {
        logger.info(`Start download from ${ pkgInfo.repoUrl }`);
        await download(pkgInfo.repoUrl, repoPath);
    }
    logger.info(`switch to version ${pkgInfo.installVersion}`);
    await checkoutVersion(repoPath, pkgInfo.checkoutTag);
    logger.debug('write package to universal-package.json');

    const plugin = resolvePlugin(ctx, repoPath);
    // check the validity of the plugin before installing it
    await plugin.check();
    logger.debug('check plugin success');

    for (let depPlugin in plugin.dep.plugin) {
      try {
        let curPkgInfo = await getPkgInfo(ctx, depPlugin);
        if (!curPkgInfo) {
          throw `the dependent plugin ${depPlugin} does not belong to the universal packge`;
        } else {
          await installAnyPlugin(ctx, depPlugin, false);
        }
        universalPkg.require(pkgInfo.repoName, pkgInfo.installVersion, curPkgInfo.repoName, curPkgInfo.installVersion);
      } catch(e) {
        logger.error(`failed to install plugin dependency ${depPlugin}`);
        throw e;
      }
    }

    plugin.preInstall.run();
    new Linker().register(bin, lib, pkgInfo.repoName.replace('feflow-plugin-', ''));
    // install when global or not exists
    if (!universalPkg.has(pkgInfo.repoName) || global) {
      universalPkg.install(pkgInfo.repoName, pkgInfo.installVersion);
    } 
    plugin.test.run();
    plugin.postInstall.run();

    logger.info('install success');
}

async function getPkgInfo(ctx: any, installPlugin: string): Promise<PkgInfo | undefined> {
  let installVersion;
  let checkoutTag;
  let repoUrl;
  let repoName;
  // install from git repo
  if (isGitRepo(installPlugin)) {
    repoUrl = installPlugin;
    installVersion = LATEST_VERSION;
    checkoutTag = await getTag(repoUrl);
    repoName = getRepoName(repoUrl);
  } else {
    const [pluginName, pluginVersion] = installPlugin.split('@');
    const repoInfo = await getRepoInfo(ctx, pluginName);
    repoUrl = repoInfo?.repo;
    repoName = repoInfo?.name;
    if (isGitRepo(repoUrl) && !(repoInfo?.tnpm)) {
      if (pluginVersion && !checkVersion(pluginVersion)) {
        throw `invalid version: ${pluginVersion}`;
      } else {
        installVersion = pluginVersion || LATEST_VERSION;
        checkoutTag = await getTag(repoUrl, installVersion === LATEST_VERSION ? undefined : installVersion);
      }
    } else {
      return;
    }
  }
  if (!repoName) {
    throw `plugin [${repoName}] does not exist`;
  }
  return new PkgInfo(repoName, repoUrl, installVersion, checkoutTag);
}

class PkgInfo {

  repoName: string;
  repoUrl: string;
  installVersion: string;
  checkoutTag: string;

  constructor(repoName: string, repoUrl: string, installVersion: string, checkoutTag: string) {
    this.repoName = repoName;
    this.repoUrl = repoUrl;
    this.installVersion = installVersion;
    this.checkoutTag = checkoutTag;
  }

}