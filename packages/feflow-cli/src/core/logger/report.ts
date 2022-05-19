import osenv from 'osenv';
import fs from 'fs';
import axios from 'axios';
import path from 'path';
import os from 'os';
import { FEFLOW_ROOT, LOG_FILE } from '../../shared/constant';
import pkgJson from '../../../package.json';

const LOGGER_LOG_PATH = path.join(osenv.home(), FEFLOW_ROOT, LOG_FILE);
const KEYS_FILE = path.join(__dirname, '../../../.keys');
const USER_NAME = os.hostname().split('-')[0];
const NOW_TIME = new Date().getTime();
const PLUGE_NAME = `feflow-${pkgJson.name.split('/').pop()}`;
const { hasTimer } = process.env;

interface IObject {
  [key: string]: string;
}
interface LogObj {
  name: string;
}
interface KeysFileContent {
  time: number;
  skey: string;
}

let keysFileContent: Partial<KeysFileContent> = {};

(async () => {
  try {
    keysFileContent = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8')) as KeysFileContent;
  } catch (err) {}
  if (!keysFileContent.time || NOW_TIME - keysFileContent.time > 5184e6) {
    const {
      data: { result },
    } = await axios.get(`http://log.feflowjs.com/api/v1/summary/getskey?rtx=${USER_NAME}`);
    keysFileContent = {
      time: NOW_TIME,
      skey: result.skey,
    };
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keysFileContent), 'utf-8');
  }
})();

const levelNames: IObject = {
  10: 'Trace',
  20: 'Debug',
  30: 'Info',
  40: 'Warn',
  50: 'Error',
  60: 'Fatal',
};

// eslint-disable-next-line import/no-mutable-exports
export let timer: NodeJS.Timeout | null = null;

async function send(logObj: LogObj | undefined, readData: string[]) {
  const loggerList = readData
    .filter((data: string) => data)
    .map((data: string) => {
      const logger = JSON.parse(data);
      const { level } = logger;
      const loggerName = logger.name || logObj?.name.split('/').pop() || PLUGE_NAME;
      return {
        level,
        msg: `[Feflow ${levelNames[level]}][${loggerName}]${logger.msg}`,
        date: new Date().getTime(),
        name: loggerName,
      };
    });
  // 清除数据
  fs.writeFile(LOGGER_LOG_PATH, '', 'utf8', () => {});
  const response = await axios.post(
    'http://log.feflowjs.com/api/v1/log/save',
    {
      plugin: loggerList[0].name,
      data: JSON.stringify(loggerList),
    },
    {
      headers: {
        skey: keysFileContent.skey,
        rtx: USER_NAME,
      },
    },
  );
  if (response.status === 204) {
    console.log('send success');
  }
}
async function report(logObj?: LogObj) {
  const readStr: string = fs.readFileSync(LOGGER_LOG_PATH, 'utf-8');
  if (readStr) {
    const readData: string[] = readStr.split('\n');
    // 数量太少暂时不上报
    if (readData.length < 20) {
      // 如果有timer则不创新新的timer
      if (!hasTimer) {
        timer = setTimeout(() => {
          (async () => {
            await send(logObj, readData);
            timer && clearTimeout(timer);
            timer = null;
          })();
        }, 5000);
      }
      return;
    }
    timer && clearTimeout(timer);
    timer = null;
    await send(logObj, readData);
  }
}
report();
