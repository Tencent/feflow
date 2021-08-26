import bunyan from 'bunyan';
import chalk from 'chalk';
import { Writable } from 'stream';
import path from 'path';
import { LOG_REPORT_BEAT_GAP, FEFLOW_ROOT, LOG_FILE, HEART_BEAT_COLLECTION_LOG } from '../../shared/constant';
import osenv from 'osenv';
import { spawn } from 'child_process';
import { getKeyFormFile, setKeyToFile } from '../../shared/file';

const root = path.join(osenv.home(), FEFLOW_ROOT);
const heartDBFile = path.join(root, HEART_BEAT_COLLECTION_LOG);
let logReportProcess: any = null;
const reportLog = path.join(__dirname, './report');
let hasCreateHeart = false;
const logReportDbKey = 'log_report_beat_time';
const { debug, silent } = process.env;
const pkg = require('../../../package.json');
const PLUGE_NAME = `feflow-${pkg.name.split('/').pop()}`;
let logger: any;
interface IObject {
  [key: string]: string;
}

interface Args {
  debug: Boolean;
}

type LogLevelString = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type LogLevel = LogLevelString | number;

interface Stream {
  type?: string;
  level?: LogLevel;
  path?: string;
  stream?: NodeJS.WritableStream | Stream;
  closeOnExit?: boolean;
  period?: string;
  count?: number;
  name?: string;
  reemitErrorEvents?: boolean;
}

const levelNames: IObject = {
  10: 'Trace',
  20: 'Debug',
  30: 'Info',
  40: 'Warn',
  50: 'Error',
  60: 'Fatal',
};

const levelColors: IObject = {
  10: 'gray',
  20: 'gray',
  30: 'green',
  40: 'orange',
  50: 'red',
  60: 'red',
};

class ConsoleStream extends Writable {
  private debug: Boolean;

  constructor(args: Args) {
    super({
      objectMode: true,
    });
    this.debug = Boolean(args.debug);
  }
  // 上报
  startReport() {
    const report = () => {
      // 子进程执行日志上报
      logReportProcess = spawn(process.argv[0], [reportLog], {
        detached: true, // 使子进程在父进程退出后继续运行
        stdio: 'ignore', // 保持后台运行
        env: {
          ...process.env, // env 无法把 ctx 传进去，会自动 string 化
          debug,
          silent,
        },
        windowsHide: true,
      });
      // 父进程不会等待子进程
      logReportProcess.unref();
    };
    let cacheValidate = false;
    const nowTime = new Date().getTime();
    const lastBeatTime = getKeyFormFile(heartDBFile, logReportDbKey);
    if (lastBeatTime) {
      // 在一次心跳时间内只允许创建一次子进程
      cacheValidate = nowTime - lastBeatTime <= LOG_REPORT_BEAT_GAP;
      // 防止瞬时大量数据，导致lastBeatTime还未更新时触发多次子进程创建
      if (!cacheValidate && !hasCreateHeart) {
        hasCreateHeart = true;
        setKeyToFile(heartDBFile, logReportDbKey, String(nowTime));
        hasCreateHeart = false;
        report();
      }
    } else if (!hasCreateHeart) {
      hasCreateHeart = true;
      setKeyToFile(heartDBFile, logReportDbKey, String(nowTime));
      hasCreateHeart = false;
      report();
    }
  }

  async _write(data: any, enc: any, callback: any) {
    const { level } = data;
    const loggerName = data.name || (logger.name && logger.name.split('/').pop()) || PLUGE_NAME;
    let msg = '';
    if (this.debug) {
      msg += `${chalk.gray(data.time)} `;
    }
    msg += chalk.keyword(levelColors[level])(`[ Feflow ${levelNames[level]} ]`);
    msg += `[ ${loggerName} ] `;
    msg += `${data.msg}\n`;
    if (data.err) {
      const err = data.err.stack || data.err.message;
      if (err) msg += `${chalk.yellow(err)}\n`;
    }
    Object.assign(data, {
      level,
      msg: `[Feflow ${levelNames[level]}][${loggerName}]${data.msg}`,
      date: new Date().getTime(),
      name: loggerName,
    });
    if (level >= 40) {
      process.stderr.write(msg);
    } else {
      process.stdout.write(msg);
    }
    this.startReport();
    callback();
  }
}

export default function createLogger(options: any) {
  options = options || {};
  const streams: Array<Stream> = [];

  streams.push({
    level: 'error',
    path: path.join(root, LOG_FILE),
  });
  streams.push({
    level: 'info',
    path: path.join(root, LOG_FILE),
  });
  if (!options.silent) {
    streams.push({
      type: 'raw',
      level: options.debug ? 'trace' : 'info',
      stream: new ConsoleStream(options),
    });
  }

  if (options.debug) {
    streams.push({
      level: 'trace',
      path: path.join(root, 'debug.log'),
    });
  }

  logger = bunyan.createLogger({
    name: options.name || 'feflow-cli',
    streams,
    serializers: {
      err: bunyan.stdSerializers.err,
    },
  });
  return logger;
}
