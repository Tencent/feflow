import { getRegistryUrl, install } from '../../shared/npm';
import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import rp from 'request-promise';
import packageJson from '../../shared/packageJson';
import {
  getTag,
  getCurrentTag,
  checkoutVersion
} from '../universal-pkg/repository/git';
import { parseYaml } from '../../shared/yaml';
import {
  UNIVERSAL_MODULES,
  UNIVERSAL_PLUGIN_CONFIG,
  LATEST_VERSION,
  FEFLOW_BIN, FEFLOW_LIB, 
} from '../../shared/constant';
import { Plugin } from '../universal-pkg/schema/plugin';
import Linker from '../universal-pkg/linker';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import versionImpl from '../universal-pkg/dep/version';

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

export async function getRepoInfo(ctx: any, packageName: string) {
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

function deleteDir(dirPath: string) {
  let files: any = [];
  if(fs.existsSync(dirPath)) {
    files = fs.readdirSync(dirPath);
    files.forEach((file: string) =>{
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

    ctx.commander.register('install', 'Install a devkit or plugin', async () => {
      const dependencies = ctx.args['_'];
      const installPluginStr = dependencies[0];
      if (!installPluginStr) {
        ctx.logger.error('parameter error') ;
        return;
      }
      try {
        await installPlugin(ctx, installPluginStr, true);
      } catch(e) {
        ctx.logger.error(`install error: ${e}`) ;
        process.exit(2);
      }
    });

    ctx.commander.register('uninstall', 'Uninstall a devkit or plugin', async () => {
      const dependencies = ctx.args['_'];
      ctx.logger.info('Uninstalling packages. This might take a couple of minutes.');
      
      const installPluginStr = dependencies[0];
      const pkgInfo = await getPkgInfo(ctx, installPluginStr);
      if (pkgInfo) {
        return uninstallUniversalPlugin(ctx, pkgInfo);
      }

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

export async function installPlugin(ctx: any, installPluginStr: string, global: boolean) {
    const { logger, universalPkg, bin, lib }
    : { logger: any, universalPkg: UniversalPkg, bin: string, lib: string } = ctx;
    const universalModules = path.join(ctx.root, UNIVERSAL_MODULES);
    installPluginStr = installPluginStr.trim();
    const pkgInfo = await getPkgInfo(ctx, installPluginStr);
    if (!pkgInfo) {
      return installNpmPlugin(ctx, ctx?.args['_']);
    }
    if (!pkgInfo.repoName) {
      throw `plugin [${pkgInfo.repoName}] does not exist`;
    }
    // if the specified version is already installed, skip it
    if (universalPkg.isInstalled(pkgInfo.repoName, pkgInfo.checkoutTag)) {
      return;
    }
    if (!global && universalPkg.isDepdenedOnOther(pkgInfo.repoName, pkgInfo.checkoutTag)) {
      return;
    }
    const repoPath = path.join(universalModules, `${pkgInfo.repoName}@${pkgInfo.installVersion}`);
    logger.debug('install version:', pkgInfo.checkoutTag);
    if (!fs.existsSync(repoPath)) {
        logger.info(`Start download from ${ pkgInfo.repoUrl }`);
        await download(pkgInfo.repoUrl, repoPath);
    }
    const linker = new Linker();
    if (pkgInfo.checkoutTag === await getCurrentTag(repoPath)) {
      return;
    }

    logger.info(`switch to version ${pkgInfo.installVersion}`);
    await checkoutVersion(repoPath, pkgInfo.checkoutTag);

    const plugin = resolvePlugin(ctx, repoPath);
    // check the validity of the plugin before installing it
    await plugin.check();
    logger.debug('check plugin success');

    const pluginBin = path.join(repoPath, `.${FEFLOW_BIN}`);
    const pluginLib = path.join(repoPath, `.${FEFLOW_LIB}`);

    const oldDependencies = universalPkg.getDependencies(pkgInfo.repoName, pkgInfo.checkoutTag);

    for (let depPlugin of plugin.dep.plugin) {
      try {
        let curPkgInfo = await getPkgInfo(ctx, depPlugin);
        if (!curPkgInfo) {
          throw `the dependent plugin ${depPlugin} does not belong to the universal packge`;
        } else {
          await installPlugin(ctx, depPlugin, false);
        }
        oldDependencies?.delete(curPkgInfo.repoName);
        const commandName = toSimpleCommand(curPkgInfo.repoName);
        linker.register(pluginBin, pluginLib, `${commandName}@${curPkgInfo.checkoutTag}`, commandName);
        universalPkg.depend(pkgInfo.repoName, pkgInfo.installVersion, curPkgInfo.repoName, curPkgInfo.installVersion);
      } catch(e) {
        logger.error(`failed to install plugin dependency ${depPlugin}`);
        throw e;
      }
    }

    // if (oldDependencies) {
    //   for (const [depPkg, depVersion] of oldDependencies) {
    //     universalPkg.removeDepend(pkgInfo.repoName, pkgInfo.installVersion, );
    //   }
    // }

    plugin.preInstall.run();
    linker.register(bin, lib, toSimpleCommand(pkgInfo.repoName));
    // install when global or not exists
    if (global || !universalPkg.isInstalled(pkgInfo.repoName, pkgInfo.checkoutTag)) {
      universalPkg.install(pkgInfo.repoName, pkgInfo.installVersion);
    } 
    // the package management information is retained only when the installation is fully successful
    global && universalPkg.saveChange();
    plugin.test.run();
    plugin.postInstall.run();

    logger.info('install success');
}

function toSimpleCommand(command: string): string {
  return command.replace('feflow-plugin-', '');
}

// when you install a universal package, return PkgInfo, otherwise return undefined
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
      if (pluginVersion && !versionImpl.check(pluginVersion)) {
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
  if (!checkoutTag) {
    throw `the version [${installVersion}] was not found`;
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

async function uninstallUniversalPlugin(ctx: any, pkgInfo: PkgInfo) {
  const { logger, universalPkg, bin, lib }
    : { logger: any, universalPkg: UniversalPkg, bin: string, lib: string } = ctx;
  const version = universalPkg.getInstalled().get(pkgInfo.repoName);
  if (!version) {
    logger.error('this plugin is not currently installed');
    return;
  }
  if (pkgInfo.installVersion != LATEST_VERSION && pkgInfo.installVersion != version) {
    logger.error(`this version of the plugin is not currently installed, 
    the version you want to uninstall is ${pkgInfo.installVersion}, 
    The installed version is ${version}`);
    return;
  }
  try {
    universalPkg.uninstall(pkgInfo.repoName, version);
  } catch(e) {
    logger.error(`uninstall failure, ${e}`);
    return;
  }
  try {
    const pluginPath = path.join(ctx.root, UNIVERSAL_MODULES, `${pkgInfo.repoName}@${version}`);
    if (fs.existsSync(pluginPath)) {
      deleteDir(pluginPath);
      new Linker().remove(bin, lib, toSimpleCommand(pkgInfo.repoName));
    }
    logger.info('uninstall success');
  } catch(e) {
    logger.info(`uninstall succeeded, but failed to clean the data, ${e}`);
  }
}
