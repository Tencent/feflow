import bunyan from 'bunyan';
import chalk from 'chalk';
import osenv from 'osenv';
import path from 'path';
import { Writable } from 'stream';

interface IObject {
  [key: string]: string;
}

interface Args {
  debug: Boolean
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
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO ',
  40: 'WARN ',
  50: 'ERROR',
  60: 'FATAL'
};

const levelColors: IObject = {
  10: 'gray',
  20: 'gray',
  30: 'green',
  40: 'yellow',
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

  _write(data: any, enc: any, callback: any) {
    const level = data.level;
    let msg = '';

    if (this.debug) {
      msg += chalk.gray(data.time) + ' ';
    }

    msg += chalk.keyword(levelColors[level])('Feflow' + ' ' + levelNames[level]) + ' ';
    msg += data.msg + '\n';

    if (data.err) {
      const err = data.err.stack || data.err.message;
      if (err) msg += chalk.yellow(err) + '\n';
    }

    if (level >= 40) {
      process.stderr.write(msg);
    } else {
      process.stdout.write(msg);
    }

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
      stream: new ConsoleStream(options)
    });
  }

  if (options.debug) {
    streams.push({
      level: 'trace',
      path: 'debug.log'
    });
  }

  const logger = bunyan.createLogger({
    name: options.name || 'feflow',
    streams: streams,
    serializers: {
      err: bunyan.stdSerializers.err
    }
  });

  return logger;
}
