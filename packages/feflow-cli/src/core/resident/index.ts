/* eslint-disable no-param-reassign */
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import lockFile from 'lockfile';
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
  FEFLOW_HOME,
  HEART_BEAT_PID,
} from '../../shared/constant';
import { checkProcessExistByPid } from '../../shared/process';
import { safeDump } from '../../shared/yaml';
import { readFileSync } from '../../shared/file';
import { createPm2Process, ErrProcCallback } from './pm2';
import { isFileExist } from '../../shared/fs';

const updateBeatScriptPath = path.join(__dirname, './update-beat.js');
const updateScriptPath = path.join(__dirname, './update');
const isSilent = process.argv.slice(3).includes(SILENT_ARG);
const disableCheck = process.argv.slice(3).includes(DISABLE_ARG);
let updateFile: LockFile;
let heartFile: LockFile;
const table = new Table();
const uTable = new Table();

/**
 * 使用pm2创建异步心跳子进程
 *
 * @param ctx Feflow实例
 */
function startUpdateBeat(ctx: Feflow) {
  /**
   * pm2 启动参数
   */
  const options = {
    script: updateBeatScriptPath,
    name: 'feflow-update-beat-process',
    env: {
      ...process.env, // env 无法把 ctx 传进去，会自动 string 化
      debug: ctx.args.debug,
      silent: ctx.args.silent,
    },
    // 由于心跳进程会不断写日志导致pm2日志文件过大，而且对于用户来说并关心心跳进程的日志，对于开发同学可以通过pm2 log来查看心跳进程的日志
    error_file: '/dev/null',
    out_file: '/dev/null',
    pid_file: `${FEFLOW_HOME}/.pm2/pid/app-pm_id.pid`,
  };

  /**
   * pm2 启动回调
   */
  const pm2StartCallback: ErrProcCallback = pm2 => (err) => {
    if (err) {
      ctx.logger.error('launch update beat pm2 process failed', err);
    }
    return pm2.disconnect();
  };

  createPm2Process(ctx, options, pm2StartCallback);
}

/**
 * 利用spawn创建异步更新子进程
 *
 * 不使用pm2的原因：更新子进程并不是常驻子进程，在运行fef命令时如果有更新才会去创建进程进行更新
 *
 * @param ctx Feflow实例
 * @param cacheValidate 缓存是否有效
 * @param latestVersion 最新版本
 */
function startUpdate(ctx: Feflow, cacheValidate: boolean, latestVersion: string) {
  const child = spawn(process.argv[0], [updateScriptPath], {
    detached: true, // 使子进程在父进程退出后继续运行
    stdio: 'ignore', // 保持后台运行
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

      ctx.logger.info('Your local templates or plugins has been updated last time. This will not affect your work at hand, just enjoy it.');
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

      ctx.logger.info('Your local universal plugins has been updated last time. This will not affect your work at hand, just enjoy it.');
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

/**
 * 如果更新和心跳文件是上锁的状态并且心跳进程不存在时先解锁
 *
 * 当心跳进程意外退出unlock没有被调用时会存在心跳和更新两个unlock文件
 * 当这两个unlock文件存在并且没有心跳进程正常运行时会导致主流程报file read timeout错误
 * 这个函数的作用是为了解决这个问题，如果更新和心跳文件是上锁的状态并且心跳进程不存在时先解锁
 *
 * @param ctx Feflow
 */
async function ensureFilesUnlocked(ctx: Feflow) {
  const beatLockPath = path.join(FEFLOW_HOME, BEAT_LOCK);
  const updateLockPath = path.join(FEFLOW_HOME, UPDATE_LOCK);
  const heartBeatPidPath = path.join(FEFLOW_HOME, HEART_BEAT_PID);
  try {
    if (!isFileExist(heartBeatPidPath)) return;
    // 当heart-beat-pid.json存在时，说明启动了最新的心跳进程，文件中会被写入当前的心跳进程，此时根据pid判断进程是否存在
    const heartBeatPid = readFileSync(heartBeatPidPath);
    ctx.logger.debug('heartBeatPid:', heartBeatPid);
    const isPsExist = await checkProcessExistByPid(heartBeatPid);
    ctx.logger.debug('fefelow-update-beat-process is exist:', isPsExist);
    if (lockFile.checkSync(beatLockPath) && !isPsExist) {
      ctx.logger.debug('beat file unlock');
      lockFile.unlockSync(beatLockPath);
    }
    if (lockFile.checkSync(updateLockPath) && !isPsExist) {
      ctx.logger.debug('update file unlock');
      lockFile.unlockSync(updateLockPath);
    }
  } catch (e) {
    ctx.logger.error('unlock beat or update file fail', e);
  }
}

export async function checkUpdate(ctx: Feflow) {
  const dbFilePath = path.join(ctx.root, UPDATE_COLLECTION);
  const autoUpdate = ctx.args['auto-update'] || String(ctx.config?.autoUpdate) === 'true';
  const nowTime = new Date().getTime();
  let latestVersion = '';
  let cacheValidate = false;

  // 如果更新和心跳文件是上锁的状态并且心跳进程不存在时先解锁
  await ensureFilesUnlocked(ctx);

  if (!updateFile) {
    const updateLockPath = path.join(ctx.root, UPDATE_LOCK);
    updateFile = new LockFile(dbFilePath, updateLockPath, ctx.logger);
  }

  const heartDBFilePath = path.join(ctx.root, HEART_BEAT_COLLECTION);
  if (!heartFile) {
    const beatLockPath = path.join(ctx.root, BEAT_LOCK);
    heartFile = new LockFile(heartDBFilePath, beatLockPath, ctx.logger);
  }

  let needToRestartUpdateBeatProcess = false;
  let updateData = await updateFile.read(UPDATE_KEY) as UpdateData;
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
  } else {
    // init
    ctx.logger.debug(`${UPDATE_COLLECTION} is illegal, init ${UPDATE_COLLECTION}`);
    // 这里维持原来的写法不做改动，在更新文件内容不合法时同时初始化心跳和更新文件
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

    // 需要重启心跳进程
    needToRestartUpdateBeatProcess = true;
  }

  const heartBeatData = await heartFile.read(BEAT_KEY);
  updateData = await updateFile.read(UPDATE_KEY) as UpdateData;
  if (isHeartBeatData(heartBeatData)) {
    const lastBeatTime = parseInt(heartBeatData, 10);

    cacheValidate = nowTime - lastBeatTime <= BEAT_GAP;
    ctx.logger.debug(`heart-beat process cache validate ${cacheValidate}, ${cacheValidate ? 'not' : ''} launch update-beat-process`);
    // 子进程心跳停止了
    if (!cacheValidate) {
      // todo：进程检测，清理一下僵死的进程(兼容不同系统)
      // 需要重启心跳进程
      needToRestartUpdateBeatProcess = true;
    }
    // 即便 心跳 停止了，latest_cli_version 也应该是之前检测到的最新值
    updateData.latest_cli_version && (latestVersion = updateData.latest_cli_version);
  } else {
    ctx.logger.debug(`${HEART_BEAT_COLLECTION} is illegal, init ${HEART_BEAT_COLLECTION}`);
    // 初始化心跳数据
    await heartFile.update(BEAT_KEY, String(nowTime));
    // 需要重启心跳进程
    needToRestartUpdateBeatProcess = true;
  }

  // 根据needToRestartUpdateBeat状态决定是否重启心跳进程
  if (needToRestartUpdateBeatProcess) {
    ctx.logger.debug('launch update-beat-process');
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
        message: chalk.yellow(`@feflow/cli's latest version is ${chalk.green(latestVersion)}, but your current version is ${chalk.red(ctx.version)}. Do you want to update it?`),
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
