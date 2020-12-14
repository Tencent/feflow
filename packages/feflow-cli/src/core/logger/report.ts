const fs = require('fs');
const axios = require('axios');
const path = require('path');
const os = require('os');
const LOGGER_LOG_PATH = path.join(__dirname, '../../../logger.log');
const KEYS_FILE = path.join(__dirname, '../../../.keys');
const USER_NAME  = os.hostname().split("-")[0];
const NOW_TIME = new Date().getTime();
const pkg = require('../../../package.json');
const PLUGE_NAME = 'feflow-' + pkg.name.split('/').pop();
let KYE_FILE = {};
interface IObject {
  [key: string]: string;
}
(async ()=>{
  try{
    KYE_FILE = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
  }catch(err){}
  if(!KYE_FILE['time'] || NOW_TIME - KYE_FILE['time'] > 5184e6){
    let {data:{result}} = await axios.get(`http://log.feflowjs.com/api/v1/summary/getskey?rtx=${USER_NAME}`);
    KYE_FILE = {
      time:NOW_TIME,
      skey:result.skey
    }
    fs.writeFileSync(KEYS_FILE,JSON.stringify(KYE_FILE),'utf-8')
  }
})();

const levelNames: IObject = {
  10: 'Trace',
  20: 'Debug',
  30: 'Info',
  40: 'Warn',
  50: 'Error',
  60: 'Fatal'
};

class loggerReport {
  constructor() {}
  init(data: Array<Object> = [], report?: boolean) {
    return new Promise(async (resolve, reject) => {
      let writeData: Array<Object> = data;
      try {
        let readData = fs.readFileSync(LOGGER_LOG_PATH, 'utf-8');
        if (readData) {
          writeData = [...writeData, ...JSON.parse(readData)];
        }
      } catch (err) {
        reject(err);
      }
      if (writeData.length && (writeData.length > 1 || report)) {
        //5s 或 数量大于20上报
        const response = await axios.post('http://log.feflowjs.com/api/v1/log/save', {
          plugin: writeData[0]['name'],
          data: JSON.stringify(writeData)
        },{
          headers:{
            skey:KYE_FILE['skey']
          }
        });
        if(response.status===204){
            writeData = [];
        }
        resolve();
      }
      if (writeData && writeData.length) {
        //非定时||上报数量过少 => 写入文件
        fs.writeFile(LOGGER_LOG_PATH, JSON.stringify(writeData), 'utf8', () => {
          resolve();
        });
      }
    });
  }

  async send(logObj: any) {
    let readData = fs.readFileSync(LOGGER_LOG_PATH, 'utf-8');
    if (readData) {
      readData = readData.split('\n');
      const loggerList = readData.filter((data: string) => data).map((data: string) => {
        const logger = JSON.parse(data);
        const level = logger.level;
        const loggerName = logger.name || (logObj.name && logObj.name.split('/').pop()) || PLUGE_NAME;
        return {
          level: level,
          msg: `[Feflow ${levelNames[level]}][${loggerName}]${logger.msg}`,
          date: new Date().getTime(),
          name: loggerName
        };
      });
      const response = await axios.post('http://log.feflowjs.com/api/v1/log/save', {
        plugin: loggerList[0]['name'],
        data: JSON.stringify(loggerList)
      },{
        headers:{
          skey:KYE_FILE['skey']
        }
      });
      if(response.status===204){
        console.log('------- report success');
      }
    }

  }

  writeLog(data: Array<Object> = []) {
    let writeData: Array<Object> = data;
    const options = {
      flags: 'a', //
      encoding: 'utf8', // utf8编码
    };
    const stderr = fs.createWriteStream(LOGGER_LOG_PATH, options);
    // 创建logger
    let logger = new console.Console(stderr);
    logger.info(111);
    let readData = fs.readFileSync(LOGGER_LOG_PATH, 'utf-8');
    if (readData) {
      writeData = [...writeData, ...JSON.parse(readData)];
    }
    fs.writeFile(LOGGER_LOG_PATH, JSON.stringify(writeData), 'utf8', () => {
      // resolve();
    });
  }
}

export default loggerReport;
