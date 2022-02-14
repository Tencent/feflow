/* eslint-disable @typescript-eslint/no-require-imports */
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import osenv from 'osenv';
import spawn from 'cross-spawn';
import _ from 'lodash';
import { UpdateData, UniversalPluginUpdateMsg } from './';
import LockFile from '../../shared/lock-file';
import packageJson from '../../shared/package-json';
import { parseYaml } from '../../shared/yaml';
import { setServerUrl } from '../../shared/git';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import {
  HEART_BEAT_COLLECTION,
  UPDATE_COLLECTION,
  BEAT_GAP,
  CHECK_UPDATE_GAP,
  FEFLOW_ROOT,
  UNIVERSAL_PKG_JSON,
  BEAT_KEY,
  BEAT_LOCK,
  UPDATE_KEY,
  UPDATE_LOCK,
} from '../../shared/constant';
import createLogger from '../logger';
import { getInstalledPlugins, getLatestVersion, getUniversalPluginVersion } from './utils';
import { getPkgInfo } from '../native/install';
import Feflow from '../index';
import { isValidConfig } from '../../shared/type-predicates';
import pkgJson from '../../../package.json';

interface ErrorInstance {
  name: string;
  message: string;
  stack: string;
}

const { debug, silent } = process.env;
const logger = createLogger({
  name: 'feflow-update-beat-process',
  debug: Boolean(debug),
  silent: Boolean(silent),
});
const root = path.join(osenv.home(), FEFLOW_ROOT);
const configPath = path.join(root, '.feflowrc.yml');
const universalPkgPath = path.join(root, UNIVERSAL_PKG_JSON);
const dbFile = path.join(root, UPDATE_COLLECTION);
const updateLock = path.join(root, UPDATE_LOCK);
const updateFile = new LockFile(dbFile, updateLock, logger);
const heartDBFile = path.join(root, HEART_BEAT_COLLECTION);
const beatLock = path.join(root, BEAT_LOCK);
const heartFile = new LockFile(heartDBFile, beatLock, logger);

// 设置特殊的静默进程名字
process.title = 'feflow-update-beat-process';

const handleException = (e: ErrorInstance): void => {
  logger.error(`update_beat_exception: ${e.name}: ${e.message} => ${e.stack}`);
};

(process as NodeJS.EventEmitter).on('uncaughtException', handleException);

(process as NodeJS.EventEmitter).on('unhandledRejection', handleException);

const heartBeat = () => {
  heartFile.update(BEAT_KEY, String(new Date().getTime()));
};

const queryCliUpdate = async () => {
  const config = parseYaml(configPath);

  if (!config || !isValidConfig(config)) {
    return;
  }
  if (config.lastUpdateCheck && +new Date() - parseInt(config.lastUpdateCheck, 10) <= 1000 * 3600 * 24) {
    return;
  }

  if (config.autoUpdate !== 'true') {
    return;
  }

  const latestVersion = await getLatestVersion('@feflow/cli', config.packageManager);
  if (latestVersion && semver.gt(latestVersion, pkgJson.version)) {
    const updateData = (await updateFile.read(UPDATE_KEY)) as UpdateData;
    if (updateData?.latest_cli_version !== latestVersion) {
      const newUpdateData = {
        ...updateData,
        latest_cli_version: latestVersion,
      };
      await updateFile.update(UPDATE_KEY, newUpdateData);
    }
  }
};

const queryPluginsUpdate = async () => {
  const config = parseYaml(configPath);
  if (!config || !isValidConfig(config)) {
    return;
  }

  Promise.all(
    getInstalledPlugins().map(async (name: string) => {
      const pluginPkgJsonPath = path.join(root, 'node_modules', name, 'package.json');
      const pkgJsonStr = fs.readFileSync(pluginPkgJsonPath, {
        encoding: 'utf8',
      });
      const pkgJson = JSON.parse(pkgJsonStr);
      const localVersion = pkgJson.version;
      const registryUrl = spawn
        .sync(config.packageManager, ['config', 'get', 'registry'], {
          windowsHide: true,
        })
        .stdout.toString()
        .replace(/\n/, '')
        .replace(/\/$/, '');
      const latestVersion = await packageJson(name, registryUrl).catch((err) => {
        logger.debug('Check plugin update error', err);
      });

      if (latestVersion && semver.gt(latestVersion, localVersion)) {
        return {
          name,
          latestVersion,
          localVersion,
        };
      }
      logger.debug('All plugins is in latest version');
    }),
  ).then(async (plugins) => {
    const pluginsWithName = plugins.filter((plugin) => plugin?.name);
    logger.debug('tnpm plugins update information', pluginsWithName);
    if (pluginsWithName.length) {
      const updateData = (await updateFile.read(UPDATE_KEY)) as UpdateData;
      if (!_.isEqual(updateData.latest_plugins, pluginsWithName)) {
        const newUpdateData = {
          ...updateData,
          latest_plugins: pluginsWithName,
        };
        await updateFile.update(UPDATE_KEY, newUpdateData);
      }
    }
  });
};

const queryUniversalPluginsUpdate = async () => {
  const config = parseYaml(configPath);
  if (!config || !isValidConfig(config)) {
    return;
  }
  setServerUrl(config.serverUrl);

  const universalPkg = new UniversalPkg(universalPkgPath);
  const latestUniversalPlugins: UniversalPluginUpdateMsg[] = [];

  for (const [pkg, version] of universalPkg.getInstalled()) {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const pkgInfo = await getPkgInfo({ root, config, logger } as Feflow, `${pkg}@${version}`).catch(
      async (e: unknown) => {
        logger.error(`update_error => pkg: ${pkg}@${version} => error: ${e}`);
      },
    );
    if (!pkgInfo) {
      continue;
    }
    const versionObj = await getUniversalPluginVersion(pkgInfo, universalPkg);
    if (versionObj.latestVersion) {
      latestUniversalPlugins.push(versionObj);
    }
  }

  logger.debug('universal plugins update information', latestUniversalPlugins);
  if (latestUniversalPlugins.length) {
    const updateData = (await updateFile.read(UPDATE_KEY)) as UpdateData;
    if (!_.isEqual(updateData.latest_universal_plugins, latestUniversalPlugins)) {
      const newUpdateData = {
        ...updateData,
        latest_universal_plugins: latestUniversalPlugins,
      };
      await updateFile.update(UPDATE_KEY, newUpdateData);
    }
  }
};

// startBeat
setInterval(heartBeat, BEAT_GAP);

// queryCliUpdate
setInterval(() => {
  queryCliUpdate().catch(handleException);
}, CHECK_UPDATE_GAP);

// queryPluginsUpdate
setInterval(() => {
  queryPluginsUpdate().catch(handleException);
}, CHECK_UPDATE_GAP);

// queryUniversalPluginsUpdate
setInterval(() => {
  queryUniversalPluginsUpdate().catch(handleException);
}, CHECK_UPDATE_GAP);
