import bunyan from 'bunyan';
import chalk from 'chalk';
import { Writable } from 'stream';
import {timer} from './report';
import path from 'path';
import {spawn} from "child_process";
const reportLog = path.join(__dirname, './report');
const pkg = require('../../../package.json');
const PLUGE_NAME = 'feflow-' + pkg.name.split('/').pop();
const process = require('process');
const { debug, silent } = process.env;
let logger:any;
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
  60: 'Fatal'
};

const levelColors: IObject = {
  10: 'gray',
  20: 'gray',
  30: 'green',
  40: 'orange',
  50: 'red',
  60: 'red'
};

class ConsoleStream extends Writable {
  private debug: Boolean;

  constructor(args: Args) {
    super({
      objectMode: true
    });
    this.debug = Boolean(args.debug);
  }

  async _write(data: any, enc: any, callback: any) {
    const level = data.level;
    const loggerName = data.name || (logger.name && logger.name.split('/').pop()) || PLUGE_NAME;
    let msg = '';
    if (this.debug) {
      msg += chalk.gray(data.time) + ' ';
    }
    msg += chalk.keyword(levelColors[level])('[ Feflow' + ' ' + levelNames[level]+' ]');
    msg += '[ '+(loggerName)+' ] ';
    msg += data.msg + '\n';
    if (data.err) {
      const err = data.err.stack || data.err.message;
      if (err) msg += chalk.yellow(err) + '\n';
    }

    Object.assign(data, {
      level: level,
      msg: `[Feflow ${levelNames[level]}][${loggerName}]${data.msg}`,
      date: new Date().getTime(),
      name:loggerName
    });
    if (level >= 40) {
      process.stderr.write(msg);
    } else {
      process.stdout.write(msg);
    }
    // 子进程执行日志上报
    const child = spawn(process.argv[0], [reportLog], {
      detached: true, // 使子进程在父进程退出后继续运行
      stdio: 'ignore', // 保持后台运行
      env: {
        ...process.env, // env 无法把 ctx 传进去，会自动 string 化
        debug,
        silent,
        hasTimer: !!timer,
      },
      windowsHide: true
    });
    // 父进程不会等待子进程
    child.unref();
    callback();
  }
}


export default function createLogger(options: any) {
  options = options || {};
  const streams: Array<Stream> = [];

  streams.push({
    path: 'logger.log',
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
      path: 'debug.log'
    });
  }

  logger = bunyan.createLogger({
    name: options.name || 'feflow',
    streams: streams,
    serializers: {
      err: bunyan.stdSerializers.err,
    }
  });
  return logger;
}
