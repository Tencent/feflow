/* eslint-disable @typescript-eslint/camelcase */
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import osenv from 'osenv';
import spawn from 'cross-spawn';
import DBInstance from './db';
import packageJson from '../../shared/packageJson';
import { parseYaml } from '../../shared/yaml';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import {
  HEART_BEAT_COLLECTION,
  BEAT_GAP,
  CHECK_UPDATE_GAP,
  FEFLOW_ROOT,
  UNIVERSAL_PKG_JSON
} from '../../shared/constant';
import loggerInstance from '../logger';
import {
  getInstalledPlugins,
  getLatestVersion,
  getUniversalPluginVersion
} from './utils';

const pkg = require('../../../package.json');
const { getPkgInfo } = require('../native/install');
const version = pkg.version;

const { debug, silent } = process.env;
const root = path.join(osenv.home(), FEFLOW_ROOT);
const configPath = path.join(root, '.feflowrc.yml');
const universalPkgPath = path.join(root, UNIVERSAL_PKG_JSON);
const dbFile = path.join(root, HEART_BEAT_COLLECTION);
const db = new DBInstance(dbFile);
const logger = loggerInstance({
  debug: Boolean(debug),
  silent: Boolean(silent)
});

// 设置特殊的静默进程名字
process.title = 'feflow-update-beat-proccess';

const heartBeat = () => {
  db.update('beat_time', String(new Date().getTime()));
};

const queryCliUpdate = async () => {
  const config = parseYaml(configPath);

  if (!config) {
    return;
  }
  if (
    config['lastUpdateCheck'] &&
    +new Date() - parseInt(config['lastUpdateCheck'], 10) <= 1000 * 3600 * 24
  ) {
    return;
  }

  if (config['autoUpdate'] !== 'true') {
    return;
  }

  const latestVersion: any = await getLatestVersion(
    '@feflow/cli',
    config['packageManager']
  );
  if (latestVersion && semver.gt(latestVersion, version)) {
    let updateData: any = await db.read('update_data');
    updateData = updateData?.['value'];
    const newUpdateData = {
      ...updateData,
      latest_cli_version: latestVersion
    };
    await db.update('update_data', newUpdateData);
  }
};

const queryPluginsUpdate = async () => {
  const config = parseYaml(configPath);
  if (!config) {
    return;
  }

  Promise.all(
    getInstalledPlugins().map(async (name: any) => {
      const pluginPath = path.join(root, 'node_modules', name, 'package.json');
      const content: any = fs.readFileSync(pluginPath);
      const pkg: any = JSON.parse(content);
      const localVersion = pkg.version;
      const registryUrl = spawn
        .sync(config['packageManager'], ['config', 'get', 'registry'])
        .stdout.toString()
        .replace(/\n/, '')
        .replace(/\/$/, '');
      const latestVersion = await packageJson(name, registryUrl).catch(
        (err: any) => {
          logger.debug('Check plugin update error', err);
        }
      );

      if (latestVersion && semver.gt(latestVersion, localVersion)) {
        return {
          name,
          latestVersion,
          localVersion
        };
      } else {
        logger.debug('All plugins is in latest version');
      }
    })
  ).then(async (plugins: any) => {
    plugins = plugins.filter((plugin: any) => {
      return plugin && plugin.name;
    });
    if (plugins.length) {
      let updateData: any = await db.read('update_data');
      updateData = updateData?.['value'];
      const newUpdateData = {
        ...updateData,
        latest_plugins: plugins
      };
      await db.update('update_data', newUpdateData);
    }
  });
};

const queryUniversalPluginsUpdate = async () => {
  const config = parseYaml(configPath);
  if (!config || !config['serverUrl']) {
    return;
  }

  const universalPkg = new UniversalPkg(universalPkgPath);
  const latestUniversalPlugins: any[] = [];

  // eslint-disable-next-line
  for (const [pkg, version] of universalPkg.getInstalled()) {
    const pkgInfo = await getPkgInfo(
      { root, config, logger },
      `${pkg}@${version}`
    );
    if (!pkgInfo) {
      continue;
    }
    const versionObj = await getUniversalPluginVersion(pkgInfo, universalPkg);
    if (versionObj.latestVersion) {
      latestUniversalPlugins.push(versionObj);
    }
  }

  if (latestUniversalPlugins.length) {
    let updateData: any = await db.read('update_data');
    updateData = updateData?.['value'];
    const newUpdateData = {
      ...updateData,
      latest_universal_plugins: latestUniversalPlugins
    };
    await db.update('update_data', newUpdateData);
  }
};

// startBeat
setInterval(heartBeat, BEAT_GAP);

// queryCliUpdate
setInterval(queryCliUpdate, CHECK_UPDATE_GAP);

// queryPluginsUpdate
setInterval(queryPluginsUpdate, CHECK_UPDATE_GAP);

// queryUniversalPluginsUpdate
setInterval(queryUniversalPluginsUpdate, CHECK_UPDATE_GAP);
