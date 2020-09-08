import path from 'path';
import { spawn } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import semver from 'semver';
import Table from 'easy-table';
import DBInstance from './db';
import {
  HEART_BEAT_COLLECTION,
  BEAT_GAP,
  CHECK_UPDATE_GAP
} from '../../shared/constant';
import { safeDump } from '../../shared/yaml';
// import { getLatestVersion } from './utils';

const updateBeatProcess = path.join(__dirname, './updateBeat');
const updateProcess = path.join(__dirname, './update');
let db: DBInstance;
const table = new Table();

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

async function checkUpdateMsg(ctx: any, db: DBInstance) {
  const cliUpdateMsg = await db.read('cli_update_msg');
  const pluginsUpdateMsg = await db.read('plugins_update_msg');
  const universalPluginsUpdateMsg = await db.read(
    'universal_plugins_update_msg'
  );

  if (cliUpdateMsg) {
    try {
      const updateMsg = JSON.parse(cliUpdateMsg['value']);
      ctx.logger.info(
        `@feflow/cil has been updated from ${updateMsg.version} to ${updateMsg.latestVersion}.Enjoy it.`
      );
      db.update('cli_update_msg', '');
    } catch (e) {
      ctx.logger.debug(e);
    }
  }

  if (pluginsUpdateMsg) {
    try {
      const updatePkg = JSON.parse(pluginsUpdateMsg['value']);
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
      console.log(table.toString());
      db.update('plugins_update_msg', '');
    } catch (e) {
      ctx.logger.debug(e);
    }
  }

  if (universalPluginsUpdateMsg) {
    try {
      const universalUpdatePkg = JSON.parse(universalPluginsUpdateMsg['value']);
      const updatePkg = JSON.parse(universalUpdatePkg);
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
        'Your local universal plugins has been updated last time.'
      );
      console.log(table.toString());

      db.update('universal_plugins_update_msg', '');
    } catch (e) {
      ctx.logger.debug(e);
    }
  }
}

export async function checkUpdate(ctx: any) {
  const dbFile = path.join(ctx.root, HEART_BEAT_COLLECTION);
  const autoUpdate =
    ctx.args['auto-update'] || String(ctx.config.autoUpdate) === 'true';
  let latestVersion: any = '';
  let cacheValidate: boolean = false;
  if (!db) {
    db = new DBInstance(dbFile);
  }

  await checkUpdateMsg(ctx, db);

  const data = await db.read('beat_time');
  const nowTime = new Date().getTime();
  if (data) {
    // 给更新进程读取
    db.update(
      'config',
      JSON.stringify({
        ...ctx.config,
        autoUpdate
      })
    );
    const lastBeatTime = parseInt(data['value'], 10);

    // add lock to keep only one updating process is running
    const updateLock = await db.read('update_lock');
    if (updateLock && nowTime - updateLock['value'] < CHECK_UPDATE_GAP) {
      return;
    } else {
      await db.update('update_lock', String(nowTime));
    }

    cacheValidate = nowTime - lastBeatTime <= BEAT_GAP;
    // 子进程心跳停止了
    if (cacheValidate) {
      // 读 db
      const cliVersionData: any = await db.read('latest_cli_version');
      latestVersion = cliVersionData && cliVersionData.value;
    } else {
      // todo：进程检测，清理一下僵死的进程(兼容不同系统)

      startUpdateBeat(ctx);
      // 不做任何网络请求
      // latestVersion = await getLatestVersion(
      //   '@feflow/cli',
      //   ctx.config.packageManager
      // );
    }
  } else {
    // 初始化心跳数据
    await db.create('beat_time', String(nowTime));

    // 初始化自动更新任务数据
    await db.create('latest_cli_version', '');
    await db.create('latest_plugins', '');
    await db.create('latest_universal_plugins', '');

    // 初始化更新信息
    await db.create('cli_update_msg', '');
    await db.create('plugins_update_msg', '');
    await db.create('universal_plugins_update_msg', '');

    // 初始化更新锁，保持只有一个进程在更新
    await db.create('update_lock', String(nowTime));
    await db.create(
      'config',
      JSON.stringify({
        ...ctx.config,
        autoUpdate
      })
    );
    startUpdateBeat(ctx);

    // 不做任何网络请求
    // latestVersion = await getLatestVersion(
    //   '@feflow/cli',
    //   ctx.config.packageManager
    // );
  }

  if (latestVersion && semver.gt(latestVersion, ctx.version)) {
    ctx.logger.debug(
      `Find new version, current version: ${ctx.version}, latest version: ${latestVersion}`
    );
    if (autoUpdate) {
      ctx.logger.debug(
        `Feflow will auto update version from ${ctx.version} to ${latestVersion}.`
      );
      ctx.logger.debug('Update message will be shown next time.');
      db.update('latest_cli_version', '');
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
