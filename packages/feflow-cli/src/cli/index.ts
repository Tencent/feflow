import fs from 'fs';
import path from 'path';
import figlet from 'figlet';
import minimist from 'minimist';
import semver from 'semver';
import bunyan from 'bunyan';
import stripComments from 'strip-json-comments';
import {
  HOOK_TYPE_BEFORE,
  HOOK_TYPE_AFTER,
  EVENT_COMMAND_BEGIN,
  FEFLOW_HOME_ORIGINAL,
  FEFLOW_HOME_E2E,
  HEART_BEAT_COLLECTION_LOG,
  LOG_FILE,
  UPDATE_JSON,
} from '../shared/constant';
import { fileExit } from '../shared/file';
import Feflow from '../core';

const pkg = JSON.parse(
  stripComments(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8').replace(/^\ufeff/u, '')),
);

export default async function entry() {
  const args = minimist(process.argv.slice(2), {
    alias: {
      h: 'help',
      v: 'version',
    },
  });

  // 根据是否进行的是端对端测试动态设置FEFLOW_HOME
  const FEFLOW_HOME = args?.e2e ? FEFLOW_HOME_E2E : FEFLOW_HOME_ORIGINAL;

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
  fileExit(path.join(FEFLOW_HOME, UPDATE_JSON));

  const feflow = new Feflow(args, FEFLOW_HOME);
  const { commander, logger, reporter, fefError } = feflow;

  const handleUnexpectedError = (
    ...args: Parameters<NodeJS.UncaughtExceptionListener | NodeJS.UnhandledRejectionListener>
  ) => {
    const [err] = args;
    logger.error(err);
    reporter.reportCommandError(err);
    fefError.printError({ error: err, msg: '', hideError: true });
  };
  // 捕获promise异常退出或catch中抛出异常
  process.on('unhandledRejection', handleUnexpectedError);
  // 捕获未被 catch 的异常
  process.on('uncaughtException', handleUnexpectedError);

  let cmdName: string | undefined = args._.shift();
  if (!cmdName && args.version) {
    reporter.report('version', args);
    logger.info(pkg.version);
    return;
  }

  if (!cmdName && !args.help) {
    printBanner(logger);
    return;
  }

  await feflow.init(cmdName);
  const localCmd = commander.get(cmdName);
  // 本地无法找到命令执行文件获取失败时转为help命令
  if (!localCmd) {
    cmdName && logger.debug(`Can't found command: ${cmdName}`);
    cmdName = 'help';
  }
  feflow.cmd = cmdName;
  feflow.hook.emit(HOOK_TYPE_BEFORE);
  feflow.hook.on(EVENT_COMMAND_BEGIN, async () => {
    try {
      await feflow.invoke(cmdName, feflow);
      feflow.hook.emit(HOOK_TYPE_AFTER);
      logger.debug(`call ${cmdName} success`);
    } catch (err) {
      logger.error(err);
      reporter.reportCommandError(err);
      fefError.printError({
        error: err,
        msg: '%s',
      });
      process.exit(2);
    }
  });
}

function ensureNodeVersion(requiredVersion: string, id: string): void {
  if (!semver.satisfies(process.version, requiredVersion)) {
    console.error(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${requiredVersion}.\nPlease upgrade your Node version.`,
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
      verticalLayout: 'default',
    },
    (err, data) => {
      if (err) {
        logger.error(err);
        process.exit(2);
      }
      logger.info(`\n${data}`);
      logger.info(`Feflow，current version: v${pkg.version}, homepage: https://github.com/Tencent/feflow`);
      logger.info('(c) powered by Tencent, aims to improve front end workflow.');
      logger.info('Run fef --help to see usage.');
    },
  );
}
