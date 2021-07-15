import Feflow from '../core';
import figlet from 'figlet';
import minimist from 'minimist';
import semver from 'semver';
import fs from 'fs';
import path from 'path';
import stripComments from 'strip-json-comments';
import {
  HOOK_TYPE_BEFORE,
  HOOK_TYPE_AFTER,
  EVENT_COMMAND_BEGIN,
  FEFLOW_HOME,
  HEART_BEAT_COLLECTION_LOG,
  LOG_FILE,
} from '../shared/constant';
import { fileExit } from '../shared/file';
import bunyan from "bunyan";

const pkg = JSON.parse(
  stripComments(
    fs
      .readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8')
      .replace(/^\ufeff/u, '')
  )
);

function ensureNodeVersion(requiredVersion: string, id: string): void {
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${requiredVersion}.\nPlease upgrade your Node version.`
    );
    process.exit(1);
  }
}

function printBanner(logger: bunyan) {
  figlet.text(
    'feflow',
    {
      font: '3D-ASCII',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    },
    (err, data) => {
      if (err) {
        logger.error(err);
        process.exit(2);
      }
      logger.info(`\n${data}`);
      logger.info(
        `Feflow，current version: v${pkg.version}, homepage: https://github.com/Tencent/feflow`
      );
      logger.info(
        ' (c) powered by Tencent, aims to improve front end workflow.                                       '
      );
      logger.info(
        ' Run fef --help to see usage.                                     '
      );
    }
  );
}

export default function entry() {
  const args = minimist(process.argv.slice(2), {
    alias: {
      h: 'help',
      v: 'version',
    }
  });

  // 检查node版本
  ensureNodeVersion(pkg.engines.node, pkg.name);
  try {
    const stats = fs.statSync(FEFLOW_HOME);
    if (!stats.isDirectory()) {
      fs.unlinkSync(FEFLOW_HOME);
    }
  } catch (e) {
    fs.mkdirSync(FEFLOW_HOME);
  }
  // 确保日志相关本地文件存在，避免报错
  fileExit(path.join(FEFLOW_HOME, HEART_BEAT_COLLECTION_LOG));
  fileExit(path.join(FEFLOW_HOME, LOG_FILE));

  const feflow = new Feflow(args);
  const { commander, logger } = feflow;
  let cmd: string | undefined = args._.shift();
  if (!cmd && args.version) {
    feflow.reporter.report('version', args);
    logger.info(pkg.version);
    return;
  }

  if (!cmd && !args.help) {
    printBanner(logger);
    return;
  }
  // 捕获promise异常退出或catch中抛出异常
  process.on('unhandledRejection', err => {
    logger.debug(err);
    feflow?.reporter?.reportCommandError(err);
    feflow.fefError?.printError({ error: err, msg: '', hideError: true });
  });

  return feflow.init(cmd).then(() => {
    const localCmd = commander.get(cmd);
    // 本地无法找到命令执行文件获取失败时转为help命令
    if (!localCmd) {
      cmd && logger.debug(`Cant found command: ${cmd}`);
      cmd = 'help';
    }
    feflow.cmd = cmd;
    feflow.hook.emit(HOOK_TYPE_BEFORE);
    feflow.hook.on(EVENT_COMMAND_BEGIN, () => {
      return feflow
        .call(cmd, feflow)
        .then(() => {
          feflow.hook.emit(HOOK_TYPE_AFTER);
          logger.debug(`call ${cmd} success`);
        })
        .catch(err => {
          logger.debug(err);
          feflow?.reporter?.reportCommandError(err);
          feflow.fefError.printError({
            error: err,
            msg: '%s'
          });
          process.exit(err.status || 2);
        });
    });
  });
}
