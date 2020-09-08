/* eslint-disable @typescript-eslint/camelcase */
import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
import Table from 'easy-table';
import DBInstance from './db';
import {
  HEART_BEAT_COLLECTION,
  UPDATE_COLLECTION,
  BEAT_GAP,
  CHECK_UPDATE_GAP
} from '../../shared/constant';
import { safeDump } from '../../shared/yaml';

const updateBeatProcess = path.join(__dirname, './updateBeat');
const updateProcess = path.join(__dirname, './update');
const isSilent = process.argv.slice(3).includes('--slient');
const disableCheck = process.argv.slice(3).includes('--disable-check');
let db: DBInstance;
let heartDB: DBInstance;
const table = new Table();
const uTable = new Table();

function startUpdateBeat(ctx: any) {
  const child = spawn(process.argv[0], [updateBeatProcess], {
    detached: true, // 使子进程在父进程退出后继续运行
    stdio: 'ignore', // 保持后台运行
    env: {
      ...process.env, // env 无法把 ctx 传进去，会自动 string 化
      debug: ctx.args.debug,
      silent: ctx.args.silent
    }
  });

  // 父进程不会等待子进程
  child.unref();
}

function startUpdate(ctx: any, cacheValidate: any, latestVersion: any) {
  const child = spawn(process.argv[0], [updateProcess], {
    detached: true,
    stdio: 'ignore',
    env: {
      ...process.env,
      debug: ctx.args.debug,
      silent: ctx.args.silent,
      cacheValidate,
      latestVersion
    }
  });

  // 父进程不会等待子进程
  child.unref();
}

async function _checkUpdateMsg(ctx: any, updateData: any = {}) {
  const _showCliUpdateM = () => {
    const updateMsg = updateData['cli_update_msg'];
    if (updateMsg) {
      const { version, latestVersion } = updateMsg;
      ctx.logger.info(
        `@feflow/cil has been updated from ${version} to ${latestVersion}. Enjoy it.`
      );
      updateData['cli_update_msg'] = '';
    }
  };

  const _showPluginsUpdateM = () => {
    const updatePkg = updateData['plugins_update_msg'];
    if (updatePkg) {
      updatePkg.forEach((pkg: any) => {
        const { name, localVersion, latestVersion } = pkg;
        table.cell('Name', name);
        table.cell(
          'Version',
          localVersion === latestVersion
            ? localVersion
            : localVersion + ' -> ' + latestVersion
        );
        table.cell('Tag', 'latest');
        table.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
        table.newRow();
      });

      ctx.logger.info(
        'Your local templates or plugins has been updated last time.'
      );
      if (!isSilent) console.log(table.toString());

      updateData['plugins_update_msg'] = '';
    }
  };

  const _showUniversalPluginsM = () => {
    const updatePkg = updateData['universal_plugins_update_msg'];

    if (updatePkg) {
      updatePkg.forEach((pkg: any) => {
        const { name, localVersion, latestVersion } = pkg;
        uTable.cell('Name', name);
        uTable.cell(
          'Version',
          localVersion === latestVersion
            ? localVersion
            : localVersion + ' -> ' + latestVersion
        );
        uTable.cell('Tag', 'latest');
        uTable.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
        uTable.newRow();
      });

      ctx.logger.info(
        'Your local universal plugins has been updated last time.'
      );
      if (!isSilent) console.log(uTable.toString());

      updateData['universal_plugins_update_msg'] = '';
    }
  };

  // cli -> tnpm -> universal
  _showCliUpdateM();
  _showPluginsUpdateM();
  _showUniversalPluginsM();

  await db.update('update_data', updateData);
}

async function _checkLock(updateData: any) {
  const updateLock = updateData?.['update_lock'];
  const nowTime = new Date().getTime();
  if (
    updateLock &&
    updateLock['time'] &&
    nowTime - updateLock['time'] < CHECK_UPDATE_GAP
  ) {
    return true;
  } else {
    updateData['update_lock'] = {
      time: String(nowTime),
      pid: process.pid
    };
    await db.update('update_data', updateData);

    // Optimistic Concurrency Control
    let nowUpdateData = await db.read('update_data');
    nowUpdateData = nowUpdateData?.['value'];
    const nowUpdateLock = nowUpdateData?.['update_lock'];
    if (nowUpdateLock && nowUpdateLock['pid'] !== process.pid) {
      return true;
    }
  }
  return false;
}

export async function checkUpdate(ctx: any) {
  const dbFile = path.join(ctx.root, UPDATE_COLLECTION);
  const autoUpdate =
    ctx.args['auto-update'] || String(ctx.config.autoUpdate) === 'true';
  const nowTime = new Date().getTime();
  let latestVersion: any = '';
  let cacheValidate: boolean = false;

  if (!db) {
    db = new DBInstance(dbFile);
  }

  const heartDBFile = path.join(ctx.root, HEART_BEAT_COLLECTION);
  if (!heartDB) {
    heartDB = new DBInstance(heartDBFile);
  }

  let updateData = await db.read('update_data');
  updateData = updateData?.['value'];
  if (updateData) {
    // add lock to keep only one updating process is running
    const isLocked = await _checkLock(updateData);
    if (isLocked) return;

    await _checkUpdateMsg(ctx, updateData);

    const data = await heartDB.read('beat_time');
    if (data) {
      const lastBeatTime = parseInt(data['value'], 10);

      cacheValidate = nowTime - lastBeatTime <= BEAT_GAP;
      // 子进程心跳停止了
      if (cacheValidate) {
        // 读 db
        const cliVersionData: any = updateData['latest_cli_version'];
        latestVersion = cliVersionData && cliVersionData.value;
      } else {
        // todo：进程检测，清理一下僵死的进程(兼容不同系统)

        startUpdateBeat(ctx);
      }
    }
  } else {
    // init
    await Promise.all([
      // 初始化心跳数据
      heartDB.create('beat_time', String(nowTime)),
      db.create('update_data', {
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
          pid: process.pid
        }
      })
    ]);
    startUpdateBeat(ctx);
  }

  // 开启更新时
  if (!disableCheck && latestVersion && semver.gt(latestVersion, ctx.version)) {
    ctx.logger.debug(
      `Find new version, current version: ${ctx.version}, latest version: ${latestVersion}`
    );
    if (autoUpdate) {
      ctx.logger.debug(
        `Feflow will auto update version from ${ctx.version} to ${latestVersion}.`
      );
      ctx.logger.debug('Update message will be shown next time.');
      return startUpdate(ctx, cacheValidate, latestVersion);
    }

    const askIfUpdateCli = [
      {
        type: 'confirm',
        name: 'ifUpdate',
        message: `${chalk.yellow(
          `@feflow/cli's latest version is ${chalk.green(
            `${latestVersion}`
          )}, but your current version is ${chalk.red(
            `${ctx.version}`
          )}. Do you want to update it?`
        )}`,
        default: true
      }
    ];
    const answer = await inquirer.prompt(askIfUpdateCli);
    if (answer.ifUpdate) {
      ctx.logger.debug(
        `Feflow will update from version ${ctx.version} to ${latestVersion}.`
      );
      ctx.logger.debug('Update message will be shown next time.');
      return startUpdate(ctx, cacheValidate, latestVersion);
    } else {
      safeDump(
        {
          ...ctx.config,
          lastUpdateCheck: +new Date()
        },
        ctx.configPath
      );
    }
  } else {
    ctx.logger.debug(`Current cli version is already latest.`);
    return startUpdate(ctx, cacheValidate, '');
  }
}
