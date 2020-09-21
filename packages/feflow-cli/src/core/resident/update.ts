/* eslint-disable @typescript-eslint/camelcase */
// 更新依赖
import semver from 'semver';
import fs from 'fs';
import path from 'path';
import osenv from 'osenv';
import DBInstance from './db';
import { install } from '../../shared/npm';
import {
  HEART_BEAT_COLLECTION,
  FEFLOW_ROOT,
  UNIVERSAL_PKG_JSON,
  UNIVERSAL_MODULES,
  FEFLOW_BIN,
  FEFLOW_LIB
} from '../../shared/constant';
import { parseYaml } from '../../shared/yaml';
import loggerInstance from '../logger';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import { loadPlugin } from '../plugin/loadUniversalPlugin';
import {
  getInstalledPlugins,
  getLatestVersion,
  updatePluginsVersion,
  getUniversalPluginVersion,
  promisify
} from './utils';

// 设置特殊的进程名字
process.title = 'feflow-update-proccess';

interface VersionObj {
  name: string;
  localVersion: any;
  latestVersion: any;
  repoPath: string;
  installVersion: any;
}

const { updateCli } = require('../native/upgrade');
const pkg = require('../../../package.json');
const { getPkgInfo, updateUniversalPlugin } = require('../native/install');
const version = pkg.version;

const { cacheValidate, debug, silent, latestVersion } = process.env;
const root = path.join(osenv.home(), FEFLOW_ROOT);
const rootPkg = path.join(root, 'package.json');
const configPath = path.join(root, '.feflowrc.yml');
const universalPkgPath = path.join(root, UNIVERSAL_PKG_JSON);
const universalModules = path.join(root, UNIVERSAL_MODULES);
const config: any = parseYaml(configPath);
const bin = path.join(root, FEFLOW_BIN);
const lib = path.join(root, FEFLOW_LIB);
const dbFile = path.join(root, HEART_BEAT_COLLECTION);
const universalPkg = new UniversalPkg(universalPkgPath);
const db = new DBInstance(dbFile);

const logger = loggerInstance({
  debug: Boolean(debug),
  silent: Boolean(silent)
});

if (!config) {
  process.exit();
}

const packageManager = config.packageManager;
const ctx = {
  root,
  universalPkg,
  logger,
  universalModules,
  bin,
  lib,
  config
};
let updateData: any;

function startUpdateCli() {
  return new Promise(async resolve => {
    if (latestVersion) {
      await updateCli(packageManager);

      const newUpdateData = {
        ...updateData,
        cli_update_msg: {
          version,
          latestVersion
        },
        latest_cli_version: ''
      };
      await db.update('update_data', newUpdateData);
    }
    resolve();
  });
}

async function startPluginsUpdate(plugins: string[]) {
  updatePluginsVersion(rootPkg, plugins);

  const needUpdatePlugins: any = [];
  plugins.forEach((plugin: any) => {
    needUpdatePlugins.push(plugin.name);
  });

  return install(
    packageManager,
    root,
    packageManager === 'yarn' ? 'add' : 'install',
    needUpdatePlugins,
    false,
    true
  ).then(async () => {
    const newUpdateData = {
      ...updateData,
      plugins_update_msg: plugins,
      latest_plugins: ''
    };
    await db.update('update_data', newUpdateData);

    logger.info('Plugin update success');
  });
}

function checkPluginsUpdate() {
  return new Promise(async (resolve, reject) => {
    if (String(cacheValidate) === 'true') {
      // 用缓存数据
      const updatePkg = updateData['latest_plugins'];
      if (updatePkg.length) {
        await startPluginsUpdate(updatePkg);
      }
      resolve();
    } else {
      // 实时拉取最新更新
      Promise.all(
        getInstalledPlugins().map(async (name: any) => {
          try {
            const pluginPath = path.join(
              root,
              'node_modules',
              name,
              'package.json'
            );
            const content: any = fs.readFileSync(pluginPath);
            const pkg: any = JSON.parse(content);
            const localVersion = pkg.version;
            const latestVersion = await getLatestVersion(name, packageManager);
            if (latestVersion && semver.gt(latestVersion, localVersion)) {
              return {
                name,
                latestVersion
              };
            } else {
              logger.debug('All plugins is in latest version');
            }
          } catch (e) {
            logger.debug(e);
            reject(e);
          }
        })
      ).then(async (plugins: any) => {
        plugins = plugins.filter((plugin: any) => {
          return plugin && plugin.name;
        });
        if (plugins.length) {
          await startPluginsUpdate(plugins);
        }
        resolve();
      });
    }
  });
}

function checkUniversalPluginsUpdate() {
  return new Promise(async resolve => {
    let updatePkg: any[] = [];
    if (String(cacheValidate) === 'true') {
      // 用缓存数据
      updatePkg = updateData['latest_universal_plugins'];
    } else {
      // 实时拉取最新更新
      const { serverUrl } = config;
      if (!serverUrl) {
        return;
      }

      // eslint-disable-next-line
      for (const [pkg, version] of universalPkg.getInstalled()) {
        // 记录更改项
        const pkgInfo = await getPkgInfo(ctx, `${pkg}@${version}`);
        if (!pkgInfo) {
          continue;
        }
        const versionObj = await getUniversalPluginVersion(
          pkgInfo,
          universalPkg
        );
        if (versionObj.latestVersion) {
          updatePkg.push(versionObj);
        }
      }
    }

    if (updatePkg.length) {
      const updateTasks = updatePkg.map(async (item: VersionObj) => {
        const { name, installVersion } = item;
        // 使用之前的方法进行更新，后续修改
        const plugin = loadPlugin(ctx, name, installVersion);
        return promisify(
          updateUniversalPlugin,
          ctx,
          name,
          installVersion,
          plugin
        );
      });

      // 顺序执行多语言插件的更新来保证依赖的插件不会同时更新而冲突
      // eslint-disable-next-line
      for (const updateTask of updateTasks) {
        await (await updateTask)();
      }

      const newUpdateData = {
        ...updateData,
        universal_plugins_update_msg: updatePkg,
        latest_universal_plugins: ''
      };
      await db.update('update_data', newUpdateData);
    }
    resolve();
  });
}

db.read('update_data')
  .then(data => {
    updateData = data?.['value'];
    return Promise.all([
      startUpdateCli(),
      checkPluginsUpdate(),
      checkUniversalPluginsUpdate()
    ]);
  })
  .then(() => {
    const newUpdateData = {
      ...updateData,
      update_lock: ''
    };
    db.update('update_data', newUpdateData);
  })
  .catch((reason: any) => {
    logger.debug(reason);
    const newUpdateData = {
      ...updateData,
      update_lock: ''
    };
    db.update('update_data', newUpdateData);
  });
