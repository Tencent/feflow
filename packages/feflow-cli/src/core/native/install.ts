import { getRegistryUrl, install } from '../../shared/npm';
import spawn from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import rp from 'request-promise';
import packageJson from '../../shared/packageJson';
import {
  getTag,
  checkoutVersion,
  getCurrentTag
} from '../universal-pkg/repository/git';
import { parseYaml } from '../../shared/yaml';
import {
  HOOK_TYPE_ON_COMMAND_REGISTERED,
  UNIVERSAL_PLUGIN_CONFIG,
  LATEST_VERSION,
  FEFLOW_BIN,
  FEFLOW_LIB,
  NPM_PLUGIN_INFO_JSON,
  UNIVERSAL_PLUGIN_INSTALL_COLLECTION,
  UPGRADE_INTERVAL
} from '../../shared/constant';
import {
  transformUrl
} from '../../shared/git';
import { Plugin } from '../universal-pkg/schema/plugin';
import Linker from '../universal-pkg/linker';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import versionImpl from '../universal-pkg/dep/version';
import InstallPersistence, { InstallAttribute } from '../universal-pkg/persistence/install';
import applyPlugins from '../plugin/applyPlugins';

let installP: InstallPersistence;
let account: any;

async function download(url: string, filepath: string): Promise<any> {
  const cloneUrl = await transformUrl(url, account);

  console.log('cloneUrl', url);
  return spawn.sync('git', ['clone', cloneUrl, filepath], {
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
  } catch (e) {
    throw `the ${UNIVERSAL_PLUGIN_CONFIG} file failed to resolve, please check the syntax, e: ${e}`;
  }
  return new Plugin(ctx, repoPath, config);
}

async function getRepoInfo(ctx: any, packageName: string) {
  const serverUrl = ctx.config?.serverUrl;
  const options = {
    url: `${serverUrl}apply/getlist?name=${packageName}`,
    method: 'GET'
  };
  return rp(options).then((response: any) => {
    const data = JSON.parse(response);
    if (data.account) {
      account = data.account;
    }
    return data.data && data.data[0];
  }).catch((err: any) => {
    ctx.logger.debug('Get repo info error', err);
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
  if (fs.existsSync(dirPath)) {
    files = fs.readdirSync(dirPath);
    files.forEach((file: string) => {
      const curPath = dirPath + '/' + file;
      if (fs.statSync(curPath).isDirectory()) {
        deleteDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

module.exports = (ctx: any) => {
  ctx.commander.register('install', 'Install a devkit or plugin', async () => {
    const dependencies = ctx.args['_'];
    const installPluginStr = dependencies[0];
    if (!installPluginStr) {
      ctx.logger.error('parameter error');
      return;
    }
    try {
      await installPlugin(ctx, installPluginStr, true);
    } catch (e) {
      ctx.logger.error(`install error: ${e}`);
      process.exit(2);
    }
  });

  ctx.commander.register(
    'uninstall',
    'Uninstall a devkit or plugin',
    async () => {
      const dependencies = ctx.args['_'];
      ctx.logger.info(
        'Uninstalling packages. This might take a couple of minutes.'
      );
      const serverUrl = ctx.config?.serverUrl;
      if (!serverUrl) {
        return uninstallNpmPlugin(ctx, dependencies);
      }
      const installPluginStr = dependencies[0];
      const pkgInfo = await getPkgInfo(ctx, installPluginStr);
      if (pkgInfo) {
        return uninstallUniversalPlugin(ctx, pkgInfo);
      }

      return uninstallNpmPlugin(ctx, dependencies);
    }
  );
};

function isGitRepo(url: string): boolean {
  return (
    /^git@.+:.+\/.+\.git$/.test(url) ||
    /^http(s)?:\/\/.+\/.+\/.+\.git$/.test(url)
  );
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

function updateNpmPluginInfo(ctx: any, pluginName: string, options: any) {
  const {
    root,
  }:{
    root: string;
  } = ctx;
  const configPath = path.join(root, NPM_PLUGIN_INFO_JSON);
  const npmPluginInfoJson = fs.existsSync(configPath) ? require(configPath) : {};
  if (options === false) {
    delete npmPluginInfoJson[pluginName];
  } else {
    if (options.globalCmd) {
      const pluginInfo = npmPluginInfoJson[pluginName] || {};
      const globalCmd = pluginInfo.globalCmd || [];
      pluginInfo.globalCmd = globalCmd
        ? Array.from(new Set<string>([...globalCmd, ...options.globalCmd]))
        : (options.globalCmd || []);
      npmPluginInfoJson[pluginName] = pluginInfo;
      delete options.globalCmd;
    }
    npmPluginInfoJson[pluginName] = Object.assign( 
      {},
      npmPluginInfoJson[pluginName] || {},
      options || {}
    );
  }
  fs.writeFileSync(
    configPath,
    JSON.stringify(
      npmPluginInfoJson,
      null,
      4
    )
  );
}

async function installJsPlugin(ctx: any, installPlugin: string) {
  const {
    bin,
    lib,
    logger
  }: {
    bin: string;
    lib: string;
    logger: any;
  } = ctx;
  const isGlobal = ctx?.args['g'];
  // install js npm plugin
  await installNpmPlugin(ctx, installPlugin);

  // if install with option -g, register as global command
  if (
    isGlobal &&
    /^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(installPlugin)
  ) {
    ctx.hook.on(HOOK_TYPE_ON_COMMAND_REGISTERED, (cmdName: string) => {
      if (cmdName) {
        logger.debug(
          `linking cmd [${cmdName}] registered by plugin ${installPlugin} to global`
        );
        // create symbol link to plugin, support global plugin cmd
        const linker = new Linker();
        linker.register(bin, lib, cmdName);
        updateNpmPluginInfo(ctx, installPlugin, {globalCmd: [cmdName]});
        logger.info(
          `can just type > "${cmdName} options" in terminal, equal to "fef ${cmdName} options"`
        );
      }
    });
    return await applyPlugins([installPlugin])(ctx);
  }
}

async function installPlugin(
  ctx: any,
  installPluginStr: string,
  global: boolean
) {
  const {
    logger,
    universalPkg,
    universalModules,
    bin,
    lib
  }: {
    logger: any;
    universalPkg: UniversalPkg;
    universalModules: string;
    bin: string;
    lib: string;
  } = ctx;
  const serverUrl = ctx.config?.serverUrl;

  installPluginStr = installPluginStr.trim();
  if (!serverUrl) {
    return installJsPlugin(ctx, installPluginStr);
  }
  const pkgInfo = await getPkgInfo(ctx, installPluginStr);
  if (!pkgInfo) {
    return installJsPlugin(ctx, installPluginStr);
  }
  if (!pkgInfo.repoName) {
    throw `plugin [${pkgInfo.repoName}] does not exist`;
  }

  // if the specified version is already installed, skip it
  if (
    universalPkg.isInstalled(pkgInfo.repoName, pkgInfo.checkoutTag, !global)
  ) {
    return;
  }

  let updateFlag = false;

  const repoPath = path.join(universalModules, `${pkgInfo.repoName}@${pkgInfo.installVersion}`);
  if (pkgInfo.installVersion === LATEST_VERSION) {
    if (universalPkg.isInstalled(pkgInfo.repoName, LATEST_VERSION)) {
      const currentVersion = await getCurrentTag(repoPath);
      if (!currentVersion || pkgInfo.checkoutTag === currentVersion) {
        return;
      } else {
        updateFlag = true;
      }
    }
  }
  if (updateFlag) {
    logger.info(`[${pkgInfo.repoName}] update the plugin to version ${pkgInfo.checkoutTag}`);
    resolvePlugin(ctx, repoPath).preUpgrade.runLess();
  } else {
    logger.info(`[${pkgInfo.repoName}] installing plugin`);
  }
  logger.debug('install version:', pkgInfo.checkoutTag);
  if (!fs.existsSync(repoPath)) {
    logger.info(`Start download from ${ pkgInfo.repoUrl }`);
    await download(pkgInfo.repoUrl, repoPath);
  }
  const linker = new Linker();

  logger.info(`switch to version: ${pkgInfo.checkoutTag}`);
  checkoutVersion(repoPath, pkgInfo.checkoutTag);

  const oldVersion = universalPkg.getInstalled().get(pkgInfo.repoName);
  let oldDependencies;
  if (global && oldVersion) {
    oldDependencies = universalPkg.getDependencies(
      pkgInfo.repoName,
      oldVersion
    );
    if (oldDependencies) {
      oldDependencies = new Map(oldDependencies);
    }
  }

  const plugin = resolvePlugin(ctx, repoPath);
  // check the validity of the plugin before installing it
  await plugin.check();
  logger.debug('check plugin success');

  const pluginBin = path.join(repoPath, `.${FEFLOW_BIN}`);
  const pluginLib = path.join(repoPath, `.${FEFLOW_LIB}`);

  for (let depPlugin of plugin.dep.plugin) {
    try {
      let curPkgInfo = await getPkgInfo(ctx, depPlugin);
      if (!curPkgInfo) {
        throw `the dependent plugin ${depPlugin} does not belong to the universal packge`;
      }
      await installPlugin(ctx, depPlugin, false);
      const commandName = toSimpleCommand(curPkgInfo.repoName);
      if (
        oldDependencies?.get(curPkgInfo.repoName) === curPkgInfo.installVersion
      ) {
        oldDependencies.delete(curPkgInfo.repoName);
      }
      universalPkg.depend(
        pkgInfo.repoName,
        pkgInfo.installVersion,
        curPkgInfo.repoName,
        curPkgInfo.installVersion
      );
      // call {pkg}@{version} and disable-check
      linker.register(
        pluginBin,
        pluginLib,
        `${commandName}@${curPkgInfo.installVersion} --disable-check --slient`,
        commandName
      );
    } catch (e) {
      logger.error(`failed to install plugin dependency ${depPlugin}`);
      throw e;
    }
  }

  if (oldVersion && oldDependencies) {
    for (const [oldPkg, oldPkgVersion] of oldDependencies) {
      universalPkg.removeDepended(
        oldPkg,
        oldPkgVersion,
        pkgInfo.repoName,
        oldVersion
      );
    }
  }

  plugin.preInstall.run();
  linker.register(bin, lib, toSimpleCommand(pkgInfo.repoName));
  // install when global or not exists
  if (global || !universalPkg.isInstalled(pkgInfo.repoName)) {
    universalPkg.install(pkgInfo.repoName, pkgInfo.installVersion);
  }

  // the package management information is retained only when the installation is fully successful
  if (global) {
    removeInvalidPkg(ctx);
  }

  universalPkg.saveChange();
  plugin.test.runLess();

  if (updateFlag) {
    plugin.postUpgrade.runLess();
    logger.info('update success');
  } else {
    plugin.postInstall.runLess();
    logger.info('install success');
  }
}

function toSimpleCommand(command: string): string {
  return command.replace('feflow-plugin-', '');
}

// when you install a universal package, return PkgInfo, otherwise return undefined
async function getPkgInfo(
  ctx: any,
  installPlugin: string
): Promise<PkgInfo | undefined> {
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
    let [pluginName, pluginVersion] = installPlugin.split('@');
    const repoInfo = await getRepoInfo(ctx, pluginName);
    if (!repoInfo) {
      return;
    }
    repoUrl = repoInfo.repo;
    repoName = repoInfo.name;
    if (isGitRepo(repoUrl) && !repoInfo.tnpm) {
      if (pluginVersion) {
        pluginVersion = versionImpl.toFull(pluginVersion);
        if (!versionImpl.check(pluginVersion)) {
          throw `invalid version: ${pluginVersion}`;
        }
      }
      installVersion = pluginVersion || LATEST_VERSION;
      checkoutTag = await getTag(
        repoUrl,
        installVersion === LATEST_VERSION ? undefined : installVersion
      );
    } else {
      return;
    }
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

  constructor(
    repoName: string,
    repoUrl: string,
    installVersion: string,
    checkoutTag: string
  ) {
    this.repoName = repoName;
    this.repoUrl = repoUrl;
    this.installVersion = installVersion;
    this.checkoutTag = checkoutTag;
  }
}

async function uninstallUniversalPlugin(ctx: any, pkgInfo: PkgInfo) {
  const {
    logger,
    universalPkg
  }: {
    logger: any;
    universalPkg: UniversalPkg;
    bin: string;
    lib: string;
  } = ctx;
  const version = universalPkg.getInstalled().get(pkgInfo.repoName);
  if (!version) {
    logger.error('this plugin is not currently installed');
    return;
  }
  if (
    pkgInfo.installVersion != LATEST_VERSION &&
    pkgInfo.installVersion != version
  ) {
    logger.error(
      `this version of the plugin is not currently installed, the version you want to uninstall is ${pkgInfo.installVersion}, The installed version is ${version}`
    );
    return;
  }
  try {
    const repoPath = path.join(ctx.universalModules, `${pkgInfo.repoName}@${pkgInfo.installVersion}`);
    const plugin = resolvePlugin(ctx, repoPath);
    plugin.preUninstall.run();
    universalPkg.uninstall(pkgInfo.repoName, version);
    plugin.postUninstall.runLess();
  } catch (e) {
    logger.error(`uninstall failure, ${e}`);
    return;
  }
  try {
    removeInvalidPkg(ctx);
    logger.info('uninstall success');
  } catch (e) {
    logger.info(`uninstall succeeded, but failed to clean the data, ${e}`);
  }
}

async function uninstallNpmPlugin(ctx: any, dependencies: []) {
  const {
    logger,
    root,
    bin,
    lib,
  }: {
    logger: any;
    root: string;
    bin: string;
    lib: string;
  } = ctx;
  dependencies.forEach((pkg: string) => {
    const npmPluginInfoPath = path.join(root, NPM_PLUGIN_INFO_JSON);
    try {
      if (fs.existsSync(npmPluginInfoPath)) {
        const npmPluginInfo = require(npmPluginInfoPath);
        const pluginGlobalCmd = npmPluginInfo?.[pkg]?.globalCmd || [];
        pluginGlobalCmd.forEach((cmd: string) => {
          new Linker().remove(bin, lib, cmd);
        })
        updateNpmPluginInfo(ctx, pkg, false);
      }       
    } catch (e) {
      logger.debug(`remove plugin registered cmd link failure, ${e}`);
    }
  });
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
}

function removePkg(ctx: any, pkg: string, version: string) {
  const {
    bin,
    lib,
    universalPkg
  }: { universalPkg: UniversalPkg; bin: string; lib: string } = ctx;
  const pluginPath = path.join(ctx.universalModules, `${pkg}@${version}`);
  if (fs.existsSync(pluginPath)) {
    deleteDir(pluginPath);
    if (!universalPkg.isInstalled(pkg)) {
      try {
        new Linker().remove(bin, lib, toSimpleCommand(pkg));
      } catch (e) {
        ctx.logger.debug(`remove link failure, ${e}`);
      }
    }
  }
}

function removeInvalidPkg(ctx: any) {
  const { universalPkg }: { universalPkg: UniversalPkg } = ctx;
  const invalidDep = universalPkg.removeInvalidDependencies();
  for (const [invalidPkg, invalidVersion] of invalidDep) {
    removePkg(ctx, invalidPkg, invalidVersion);
  }
}


// update only the plugins installed globally
async function updateUniversalPlugin(ctx: any, pkg: string, version: string, plugin: Plugin) {
  if (!installP) {
    const dbFile = path.join(ctx.root, UNIVERSAL_PLUGIN_INSTALL_COLLECTION);
    installP = new InstallPersistence(dbFile);
  }
  const i = await installP.find(pkg, version);
  if (!canUpgrade(i?.attributes.upgradeTime)) {
    return;
  }
  const universalPkg = ctx.universalPkg as UniversalPkg;
  const dependedOn = universalPkg.getDepended(pkg, version);
  // update parent
  if (dependedOn) {
    for (const [dependedOnPkg, dependedOnVersion] of dependedOn) {
      if (dependedOnVersion !== LATEST_VERSION) {
        continue;
      }
      await updatePlugin(ctx, dependedOnPkg, dependedOnVersion);
    }
  }
  const newVersion = universalPkg.getInstalled().get(pkg);
  if (newVersion === version && version === LATEST_VERSION && plugin.autoUpdate) {
    await updatePlugin(ctx, pkg, version);
  }
}

async function updatePlugin(ctx: any, pkg: string, version: string) {
  const i = await installP.find(pkg, version);
  if (!canUpgrade(i?.attributes.upgradeTime)) {
    return;
  }
  const { universalPkg }: { universalPkg: UniversalPkg } = ctx;
  const isGlobal = universalPkg.isInstalled(pkg, version);
  try {
    await installPlugin(ctx, `${pkg}@${version}`, isGlobal);
  } catch(e) {
    ctx.logger.error(`[${pkg}] update failure, ${e}`);
  }
  const installAttribute = new InstallAttribute(i?.attributes);
  installAttribute.upgradeTime = Date.now();
  installP.save(pkg, version, '', installAttribute);
}

function canUpgrade(lastUpgradeTime: number | undefined): boolean {
  if (lastUpgradeTime && Date.now() - lastUpgradeTime < UPGRADE_INTERVAL) {
    return false;
  }
  return true;
}

module.exports.installPlugin = installPlugin;
module.exports.updateUniversalPlugin = updateUniversalPlugin;
module.exports.getRepoInfo = getRepoInfo;
