import fs from 'fs';
import path from 'path';
import osenv from 'osenv';
import semver from 'semver';

import LockFile from '@/shared/lock-file';
import { install } from '@/shared/npm';
import {
  FEFLOW_BIN,
  FEFLOW_LIB,
  FEFLOW_ROOT,
  UNIVERSAL_MODULES,
  UNIVERSAL_PKG_JSON,
  UPDATE_COLLECTION,
  UPDATE_KEY,
  UPDATE_LOCK,
} from '@/shared/constant';
import { setServerUrl } from '@/shared/git';
import { parseYaml } from '@/shared/yaml';

import createLogger from '@/core/logger';
import { UniversalPkg } from '@/core/universal-pkg/dep/pkg';
import { loadPlugin } from '@/core/plugin/load-universal-plugin';
import { updateCli } from '@/core/native/upgrade';
import { getPkgInfo, updateUniversalPlugin } from '@/core/native/install';
import pkgJson from 'package.json';

import { PluginUpdateMsg, UpdateData, UniversalPluginUpdateMsg } from './';
import {
  getInstalledPlugins,
  getLatestVersion,
  getUniversalPluginVersion,
  promisify,
  updatePluginsVersion,
} from './utils';
import { FeflowConfig, isValidConfig } from '../../shared/type-predicates';
import Feflow from '../index';

// 设置特殊的进程名字
process.title = 'feflow-update-process';

const { cacheValidate, debug, silent, latestVersion } = process.env;
const root = path.join(osenv.home(), FEFLOW_ROOT);
const rootPkg = path.join(root, 'package.json');
const configPath = path.join(root, '.feflowrc.yml');
const universalPkgPath = path.join(root, UNIVERSAL_PKG_JSON);
const universalModules = path.join(root, UNIVERSAL_MODULES);
const config = parseYaml(configPath);
const bin = path.join(root, FEFLOW_BIN);
const lib = path.join(root, FEFLOW_LIB);
const dbFile = path.join(root, UPDATE_COLLECTION);
const updateLock = path.join(root, UPDATE_LOCK);
const universalPkg = new UniversalPkg(universalPkgPath);
const updateFile = new LockFile(dbFile, updateLock);

const logger = createLogger({
  name: 'feflow-update-process',
  debug: Boolean(debug),
  silent: Boolean(silent),
});

if (!isValidConfig(config)) {
  process.exit();
}

const { packageManager } = config;
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const ctx = {
  root,
  universalPkg,
  logger,
  universalModules,
  bin,
  lib,
  config,
} as Feflow;

process.on('uncaughtException', (e) => {
  logger.error(`update_exception: ${e.name}: ${e.message} => ${e.stack}`);
});

process.on('unhandledRejection', handleRejection);

let updateData: UpdateData;
update();

async function update() {
  updateFile
    .read(UPDATE_KEY)
    .then(async (data) => {
      updateData = data && typeof data === 'object' ? data : {};
      return Promise.all([startUpdateCli(), checkPluginsUpdate(), checkUniversalPluginsUpdate()]).catch((error) => {
        handleRejection(error);
      });
    })
    .then(() => {
      updateData.update_lock = undefined;
      updateFile.update(UPDATE_KEY, updateData);
    })
    .catch((reason) => {
      updateData.update_lock = undefined;
      updateFile.update(UPDATE_KEY, updateData);

      logger.debug(reason);
      handleRejection(reason);
    });
}

function handleRejection(reason: unknown) {
  logger.error(`update_rejection: ${reason}`);
}

async function startUpdateCli() {
  if (!latestVersion) {
    return;
  }

  await updateCli(packageManager);
  updateData.cli_update_msg = {
    version: pkgJson.version,
    latestVersion,
  };
  updateData.latest_cli_version = '';
}

async function startPluginsUpdate(plugins: PluginUpdateMsg[]) {
  updatePluginsVersion(rootPkg, plugins);

  const needUpdatePlugins: string[] = [];
  plugins.forEach((plugin) => {
    needUpdatePlugins.push(plugin.name);
  });

  return install(packageManager, root, packageManager === 'yarn' ? 'add' : 'install', needUpdatePlugins, false).then(
    () => {
      updateData.plugins_update_msg = plugins;
      updateData.latest_plugins = undefined;

      logger.info('Plugin update success');
    },
  );
}

async function checkPluginsUpdate() {
  return new Promise<void>(async (resolve, reject) => {
    if (Boolean(cacheValidate)) {
      // 用缓存数据
      const updatePkg = updateData.latest_plugins;
      if (updatePkg?.length) {
        await startPluginsUpdate(updatePkg);
      }
      resolve();
    } else {
      const installedPlugins = getInstalledPlugins();
      const pluginsToUpdate: PluginUpdateMsg[] = [];
      const checkUpdatePromises = installedPlugins.map(async (pluginName: string) => {
        try {
          const pluginPath = path.join(root, 'node_modules', pluginName, 'package.json');
          const content = fs.readFileSync(pluginPath, {
            encoding: 'utf8',
          });
          const pkgInfo = JSON.parse(content);
          const localVersion = pkgInfo.version;
          const latestVersion = await getLatestVersion(pluginName, packageManager);
          if (latestVersion && semver.gt(latestVersion, localVersion)) {
            pluginsToUpdate.push({
              name: pluginName,
              latestVersion,
            });
          }
          logger.debug('All plugins is in latest version');
        } catch (e) {
          logger.debug(e);
          reject(e);
        }
      });
      // 实时拉取最新更新
      await Promise.all(checkUpdatePromises);
      if (pluginsToUpdate.length) {
        await startPluginsUpdate(pluginsToUpdate);
      }
      resolve();
    }
  });
}

async function checkUniversalPluginsUpdate() {
  let updatePkg = [];
  const { serverUrl } = config as FeflowConfig;
  if (!serverUrl) {
    return;
  }
  setServerUrl(serverUrl);
  const { latest_universal_plugins: latestUniversalPlugins } = updateData;
  if (String(cacheValidate) === 'true' && latestUniversalPlugins) {
    // 用缓存数据
    updatePkg = latestUniversalPlugins;
  } else {
    // 实时拉取最新更新

    for (const [pkg, version] of universalPkg.getInstalled()) {
      // 记录更改项
      const pkgInfo = await getPkgInfo(ctx, `${pkg}@${version}`).catch((e: string) => {
        logger.error(`update_error => pkg: ${pkg}@${version} => error: ${e}`);
      });
      if (!pkgInfo) {
        continue;
      }
      const versionObj = await getUniversalPluginVersion(pkgInfo, universalPkg);
      if (versionObj.latestVersion) {
        updatePkg.push(versionObj);
      }
    }
  }

  if (updatePkg.length) {
    const updateTasks = updatePkg.map(async (item: UniversalPluginUpdateMsg) => {
      const { name, installVersion } = item;
      // 使用之前的方法进行更新，后续修改
      const plugin = loadPlugin(ctx, name, installVersion);
      return promisify(updateUniversalPlugin, ctx, name, installVersion, plugin);
    });

    // 顺序执行多语言插件的更新来保证依赖的插件不会同时更新而冲突
    for (const updateTask of updateTasks) {
      await (
        await updateTask
      )();
    }

    updateData.universal_plugins_update_msg = updatePkg;
    updateData.latest_universal_plugins = undefined;
  }
}
