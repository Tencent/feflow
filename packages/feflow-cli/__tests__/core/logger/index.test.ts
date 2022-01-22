/* eslint-disable no-param-reassign */
import path from 'path';
import fs from 'fs';
import osenv from 'osenv';

import createLogger from '../../../src/core/logger';
import { FEFLOW_ROOT, LOG_FILE } from '../../../src/shared/constant';

const captureStream = (stream: NodeJS.WriteStream) => {
  const oldWrite = stream.write;
  let buf = '';
  // @ts-ignore
  stream.write = function (chunk, encoding, callback) {
    buf += chunk.toString();
    return oldWrite.call(stream, chunk, encoding, callback);
  };

  return {
    unhook: () => {
      stream.write = oldWrite;
    },
    captured: () => buf,
  };
};

describe('@feflow/core - Logger system', () => {
  let hook: ReturnType<typeof captureStream>;

  before(() => {
    const LOGGER_LOG_PATH = path.join(osenv.home(), FEFLOW_ROOT, LOG_FILE);
    // 确保log文件存在
    fs.appendFileSync(LOGGER_LOG_PATH, '');
  });

  beforeEach(() => {
    hook = captureStream(process.stderr);
  });

  afterEach(() => {
    hook.unhook();
  });

  it('test debug and silent', () => {
    const log = createLogger({
      debug: true,
      silent: true,
    });
    log.debug('hello feflow');
  });

  it('test no debug and silent', () => {
    const log = createLogger({
      debug: true,
      silent: true,
    });
    log.info('hello feflow');
  });

  it('test debug', () => {
    const log = createLogger({
      debug: true,
      silent: true,
    });
    log.debug('hello feflow');
  });

  it('test warn', () => {
    const log = createLogger({
      debug: true,
      silent: true,
    });
    log.warn('hello feflow');
  });

  it('test error', () => {
    const log = createLogger({
      debug: true,
      silent: true,
    });
    log.error('hello feflow');
  });
});
