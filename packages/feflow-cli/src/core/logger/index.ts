import bunyan from 'bunyan';
import chalk from 'chalk';
import { Writable } from 'stream';
// import loggerReport from './report';

const pkg = require('../../../package.json');
const PLUGE_NAME = 'feflow-' + pkg.name.split('/').pop();
const process = require('process');
// let timer:any;
let logger:any;
// const report = new loggerReport();
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

// var loggerArr:Array<Object> = [];

// process.on('SIGINT',async ()=>{
//   await report.init(loggerArr);
//   // 操作中断
//   process.exit();
// });
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
    const loggerName = (logger.name && logger.name.split('/').pop()) || PLUGE_NAME;
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
    //每次触发logger进行存储 大于20条上报
    // await report.init([{
    //   level: level,
    //   msg: `[Feflow ${levelNames[level]}][${loggerName}]${data.msg}`,
    //   date: new Date().getTime(),
    //   name:loggerName
    // }]);

    if (level >= 40) {
      process.stderr.write(msg);
    } else {
      process.stdout.write(msg);
    }
    // clearTimeout(timer);
    // //单次logger上报间隔大于5s时自动进行一次上报
    // timer = setTimeout(async ()=>{
    //   await report.init([],true);
    // },5000)
    callback();
  }
}
export default function createLogger(options: any) {
  options = options || {};
  const streams: Array<Stream> = [];

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
      err: bunyan.stdSerializers.err
    }
  });
  return logger;
}
