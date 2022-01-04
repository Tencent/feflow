/* eslint-disable no-param-reassign */
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
import Table from 'easy-table';
import Feflow from '../';
import LockFile from '../../shared/lock-file';
import {
  BEAT_GAP,
  BEAT_KEY,
  BEAT_LOCK,
  CHECK_UPDATE_GAP,
  DISABLE_ARG,
  HEART_BEAT_COLLECTION,
  SILENT_ARG,
  UPDATE_COLLECTION,
  UPDATE_KEY,
  UPDATE_LOCK,
} from '../../shared/constant';
import { safeDump } from '../../shared/yaml';

const updateBeatScript = path.join(__dirname, './update-beat');
const updateScript = path.join(__dirname, './update');
const isSilent = process.argv.slice(3).includes(SILENT_ARG);
const disableCheck = process.argv.slice(3).includes(DISABLE_ARG);
let updateFile: LockFile;
let heartFile: LockFile;
const table = new Table();
const uTable = new Table();

function startUpdateBeat(ctx: Feflow) {
  const child = spawn(process.argv[0], [updateBeatScript], {
    detached: true, // 使子进程在父进程退出后继续运行
    stdio: 'ignore', // 保持后台运行
    env: {
      ...process.env, // env 无法把 ctx 传进去，会自动 string 化
      debug: ctx.args.debug,
      silent: ctx.args.silent,
    },
    windowsHide: true,
  });

  // 父进程不会等待子进程
  child.unref();
}

function startUpdate(ctx: Feflow, cacheValidate: boolean, latestVersion: string) {
  const child = spawn(process.argv[0], [updateScript], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      debug: ctx.args.debug,
      silent: ctx.args.silent,
      cacheValidate: String(cacheValidate),
      latestVersion,
    },
    windowsHide: true,
  });

  // 父进程不会等待子进程
  child.unref();
}

async function checkUpdateMsg(ctx: Feflow, updateData: UpdateData) {
  const showCliUpdateM = () => {
    const updateMsg = updateData.cli_update_msg;
    if (updateMsg) {
      const { version, latestVersion } = updateMsg;
      ctx.logger.info(`@feflow/cil has been updated from ${version} to ${latestVersion}. Enjoy it.`);
      updateData.cli_update_msg = undefined;
    }
  };

  const showPluginsUpdateM = () => {
    const updatePkg = updateData.plugins_update_msg;
    if (updatePkg) {
      updatePkg.forEach((pkg) => {
        const { name, localVersion, latestVersion } = pkg;
        table.cell('Name', name);
        table.cell('Version', localVersion === latestVersion ? localVersion : `${localVersion} -> ${latestVersion}`);
        table.cell('Tag', 'latest');
        table.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
        table.newRow();
      });

      ctx.logger.info(
        'Your local templates or plugins has been updated last time. This will not affect your work at hand, just enjoy it.',
      );
      if (!isSilent) console.log(table.toString());

      updateData.plugins_update_msg = undefined;
    }
  };

  const showUniversalPluginsM = () => {
    const updatePkg = updateData.universal_plugins_update_msg;

    if (updatePkg) {
      updatePkg.forEach((pkg) => {
        const { name, localVersion, latestVersion } = pkg;
        uTable.cell('Name', name);
        uTable.cell('Version', localVersion === latestVersion ? localVersion : `${localVersion} -> ${latestVersion}`);
        uTable.cell('Tag', 'latest');
        uTable.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
        uTable.newRow();
      });

      ctx.logger.info(
        'Your local universal plugins has been updated last time. This will not affect your work at hand, just enjoy it.',
      );
      if (!isSilent) console.log(uTable.toString());

      updateData.universal_plugins_update_msg = undefined;
    }
  };

  // cli -> tnpm -> universal
  showCliUpdateM();
  showPluginsUpdateM();
  showUniversalPluginsM();

  updateFile.update(UPDATE_KEY, updateData);
}

async function checkLock(updateData: UpdateData) {
  const updateLock = updateData?.update_lock;
  const nowTime = new Date().getTime();
  if (updateLock?.time && nowTime - Number(updateLock.time) < CHECK_UPDATE_GAP) {
    return true;
  }
  updateData.update_lock = {
    time: nowTime,
    pid: process.pid,
  };
  await updateFile.update(UPDATE_KEY, updateData);

  // Optimistic Concurrency Control
  const currUpdateData = await updateFile.read(UPDATE_KEY);
  return isUpdateData(currUpdateData) && currUpdateData.update_lock?.pid !== process.pid;
}

export async function checkUpdate(ctx: Feflow) {
  const dbFilePath = path.join(ctx.root, UPDATE_COLLECTION);
  const autoUpdate = ctx.args['auto-update'] || String(ctx.config?.autoUpdate) === 'true';
  const nowTime = new Date().getTime();
  let latestVersion = '';
  let cacheValidate = false;

  if (!updateFile) {
    const updateLockPath = path.join(ctx.root, UPDATE_LOCK);
    updateFile = new LockFile(dbFilePath, updateLockPath, ctx.logger);
  }

  const heartDBFilePath = path.join(ctx.root, HEART_BEAT_COLLECTION);
  if (!heartFile) {
    const beatLockPath = path.join(ctx.root, BEAT_LOCK);
    heartFile = new LockFile(heartDBFilePath, beatLockPath, ctx.logger);
  }

  const updateData = await updateFile.read(UPDATE_KEY);
  if (isUpdateData(updateData)) {
    // add lock to keep only one updating process is running
    const isLocked = await checkLock(updateData);
    if (isLocked) return ctx.logger.debug('one updating process is running');

    const {
      cli_update_msg: cliUpdateMsg,
      plugins_update_msg: pluginsUpdateMsg,
      universal_plugins_update_msg: universalPluginsUpdateMsg,
    } = updateData;

    if (cliUpdateMsg || pluginsUpdateMsg || universalPluginsUpdateMsg) {
      await checkUpdateMsg(ctx, updateData);
    }

    const heartBeatData = await heartFile.read(BEAT_KEY);
    if (isHeartBeatData(heartBeatData)) {
      const lastBeatTime = parseInt(heartBeatData, 10);

      cacheValidate = nowTime - lastBeatTime <= BEAT_GAP;
      ctx.logger.debug(`heart-beat process cache validate ${cacheValidate}`);
      // 子进程心跳停止了
      if (!cacheValidate) {
        // todo：进程检测，清理一下僵死的进程(兼容不同系统)
        startUpdateBeat(ctx);
      }
      // 即便 心跳 停止了，latest_cli_version 也应该是之前检测到的最新值
      updateData.latest_cli_version && (latestVersion = updateData.latest_cli_version);
    }
  } else {
    // init
    ctx.logger.debug('init heart-beat for update detective');
    await Promise.all([
      // 初始化心跳数据
      heartFile.update(BEAT_KEY, String(nowTime)),
      updateFile.update(UPDATE_KEY, {
        // 初始化自动更新任务数据
        latest_cli_version: '',
        latest_plugins: '',
        latest_universal_plugins: '',
        // 初始化更新信息
        cli_update_msg: '',
        plugins_update_msg: '',
        universal_plugins_update_msg: '',
        // 初始化更新锁，保持只有一个进程在更新
        update_lock: {
          time: String(nowTime),
          pid: process.pid,
        },
      }),
    ]);
    startUpdateBeat(ctx);
  }

  // 开启更新时
  if (!disableCheck && latestVersion && semver.gt(latestVersion, ctx.version)) {
    ctx.logger.debug(`Find new version, current version: ${ctx.version}, latest version: ${latestVersion}`);
    if (autoUpdate) {
      ctx.logger.debug(`Feflow will auto update version from ${ctx.version} to ${latestVersion}.`);
      ctx.logger.debug('Update message will be shown next time.');
      return startUpdate(ctx, cacheValidate, latestVersion);
    }

    const askIfUpdateCli = [
      {
        type: 'confirm',
        name: 'ifUpdate',
        message: chalk.yellow(
          `@feflow/cli's latest version is ${chalk.green(latestVersion)}, but your current version is ${chalk.red(
            ctx.version,
          )}. Do you want to update it?`,
        ),
        default: true,
      },
    ];
    const answer = await inquirer.prompt(askIfUpdateCli);
    if (answer.ifUpdate) {
      ctx.logger.debug(`Feflow will update from version ${ctx.version} to ${latestVersion}.`);
      ctx.logger.debug('Update message will be shown next time.');
      return startUpdate(ctx, cacheValidate, latestVersion);
    }
    safeDump(
      {
        ...ctx.config,
        lastUpdateCheck: +new Date(),
      },
      ctx.configPath,
    );
  } else {
    ctx.logger.debug('Current cli version is already latest.');
    return startUpdate(ctx, cacheValidate, '');
  }
}

export interface PluginUpdateMsg {
  name: string;
  localVersion?: string;
  latestVersion: string;
}

export interface UniversalPluginUpdateMsg {
  name: string;
  localVersion: string;
  latestVersion: string;
  repoPath: string;
  installVersion: string;
}

export interface UpdateData {
  update_lock?: {
    time: number;
    pid: number;
  };
  cli_update_msg?: {
    version: string;
    latestVersion: string;
  };
  latest_cli_version?: string;
  plugins_update_msg?: PluginUpdateMsg[];
  latest_plugins?: PluginUpdateMsg[];
  universal_plugins_update_msg?: UniversalPluginUpdateMsg[];
  latest_universal_plugins?: UniversalPluginUpdateMsg[];
}

function isUpdateData(data: unknown): data is UpdateData {
  return !!(data && typeof data === 'object');
}

type HeartBeatData = string;
function isHeartBeatData(data: unknown): data is HeartBeatData {
  return typeof data === 'string';
}
