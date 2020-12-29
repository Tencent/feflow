import path from 'path';
import logger from '../../../src/core/logger';
import {fileExit} from "../../../src/shared/file";
import osenv from "osenv";
import {FEFLOW_ROOT, LOG_FILE} from "../../../src/shared/constant";

const LOGGER_LOG_PATH = path.join(osenv.home(), FEFLOW_ROOT, LOG_FILE);
// 确保log文件存在
fileExit(LOGGER_LOG_PATH);

const captureStream = (stream: any) => {
  const oldWrite = stream.write;
  let buf = '';
  stream.write = function(chunk: any, encoding: any, callback: any) {
    buf += chunk.toString();
    oldWrite.apply(stream, arguments);
  };

  return {
    unhook: () => {
      stream.write = oldWrite;
    },
    captured: () => {
      return buf;
    }
  };
};

describe('@feflow/core - Logger system', () => {
  let hook: any;

  beforeEach(() => {
    hook = captureStream(process.stderr);
  });

  afterEach(() => {
    hook.unhook();
  });

  it('test debug and silent', () => {
    const log = logger({
      debug: true,
      silent: true
    });
    log.debug('hello feflow');
  });

  it('test no debug and silent', () => {
    const log = logger({})
    log.info('hello feflow')
  });

  it('test debug', () => {
    const log = logger({
      debug: true,
      silent: false
    });
    log.debug('hello feflow');
  });

  it('test warn', () => {
    const log = logger({
      debug: true,
      silent: false
    });
    log.warn('hello feflow');
  });

  it('test error', () => {
    const log = logger({
      debug: true,
      silent: false
    });
    log.error('hello feflow');
  });
});
