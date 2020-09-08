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
  getUniversalPluginVersion
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

async function startUpdateCli() {
  if (latestVersion) {
    await updateCli(packageManager);

    // 存储更新结果
    db.update(
      'cli_update_msg',
      JSON.stringify({
        version,
        latestVersion
      })
    );

    // 清除缓存
    db.update('latest_cli_version', '');
  }
}

function startPluginsUpdate(plugins: string[]) {
  updatePluginsVersion(rootPkg, plugins);

  db.update('plugins_update_msg', JSON.stringify(plugins));

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
  ).then(() => {
    db.update('latest_plugins', '');
    logger.info('Plugin update success');
  });
}

async function checkPluginsUpdate() {
  if (String(cacheValidate) === 'true') {
    // 用缓存数据
    const latestPlugins = await db.read('latest_plugins');
    if (latestPlugins) {
      try {
        const updatePkg = JSON.parse(latestPlugins['value'] || '[]');
        if (updatePkg.length) {
          startPluginsUpdate(updatePkg);
        }
      } catch (e) {
        logger.debug(e);
      }
    }
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
        }
      })
    ).then((plugins: any) => {
      plugins = plugins.filter((plugin: any) => {
        return plugin && plugin.name;
      });
      if (plugins.length) {
        startPluginsUpdate(plugins);
      }
    });
  }
}

async function checkUniversalPluginsUpdate() {
  if (String(cacheValidate) === 'true') {
    // 用缓存数据
    const latestPlugins = await db.read('latest_universal_plugins');
    if (latestPlugins) {
      try {
        const cachePlugins = latestPlugins['value'];
        const updatePkg = JSON.parse(cachePlugins || '[]');
        db.update('universal_plugins_update_msg', cachePlugins);
        if (updatePkg.length) {
          updatePkg.map(async (item: VersionObj) => {
            const { name, installVersion } = item;
            // 使用之前的方法进行更新，后续修改
            const plugin = loadPlugin(ctx, name, installVersion);
            await updateUniversalPlugin(ctx, name, installVersion, plugin);
          });
        }
      } catch (e) {
        logger.debug(e);
      }
    }
  } else {
    // 实时拉取最新更新
    const { serverUrl } = config;
    if (!serverUrl) {
      return;
    }

    const latestUniversalPlugins: any[] = [];

    // eslint-disable-next-line
    for (const [pkg, version] of universalPkg.getInstalled()) {
      // 记录更改项
      const pkgInfo = await getPkgInfo(ctx, `${pkg}@${version}`);
      if (!pkgInfo) {
        continue;
      }
      const versionObj = await getUniversalPluginVersion(pkgInfo, universalPkg);
      if (versionObj.latestVersion) {
        latestUniversalPlugins.push(versionObj);

        // 使用之前的方法进行更新，后续修改
        const plugin = loadPlugin(ctx, pkg, version);
        await updateUniversalPlugin(ctx, pkg, version, plugin);
      }
    }
    db.update(
      'universal_plugins_update_msg',
      JSON.stringify(latestUniversalPlugins)
    );
  }
  db.update('latest_universal_plugins', '');
}

async function checkUpdate() {
  // 保持之前的顺序不变
  await startUpdateCli();
  await checkPluginsUpdate();
  await checkUniversalPluginsUpdate();
  db.update('update_lock', '');
}

checkUpdate();
