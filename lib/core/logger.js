'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');
const osenv = require('osenv');
const bunyan = require('bunyan');
const chalk = require('chalk');
const Writable = require('stream').Writable;
const { formatDate } = require('../utils');

const levelNames = {
  10: 'TRACE',
  20: 'DEBUG',
  30: 'INFO ',
  40: 'WARN ',
  50: 'ERROR',
  60: 'FATAL'
};

const levelColors = {
  10: 'gray',
  20: 'gray',
  30: 'green',
  40: 'bgYellow',
  50: 'bgRed',
  60: 'bgRed'
};

function ConsoleStream(env) {
  Writable.call(this, {objectMode: true});

  this.debug = env.debug;
}

require('util').inherits(ConsoleStream, Writable);

ConsoleStream.prototype._write = function (data, enc, callback) {
  const level = data.level;
  let msg = '';
  // Time
  if (this.debug) {
    msg += chalk.gray(formatDate('yyyy-MM-dd hh:mm:ss', data.time)) + ' ';
  }

  // Level
  msg += chalk[levelColors[level]]('Feflow' + ' ' + levelNames[level]) + ' ';

  // Message
  msg += data.msg + '\n';

  // Error
  if (data.err) {
    const err = data.err.stack || data.err.message;
    if (err) msg += chalk.yellow(err) + '\n';
  }

  if (level >= 40) {
    process.stderr.write(msg);
  } else {
    process.stdout.write(msg);
  }

  if (!this.debug) {
    const logDir = pathFn.join(osenv.home(), './.feflow/logs');
    const today = formatDate('yyyy-MM-dd', new Date());
    const logPath = pathFn.join(logDir, `${today}.log`);
    fs.appendFileSync(logPath, msg);
  }

  callback();
};

function createLogger(options) {
  options = options || {};

  const streams = [];

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

  // Alias for logger levels
  logger.d = logger.debug;
  logger.i = logger.info;
  logger.w = logger.warn;
  logger.e = logger.error;
  logger.log = logger.info;

  return logger;
}

module.exports = createLogger;
