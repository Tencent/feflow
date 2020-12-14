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

export let timer: NodeJS.Timeout | null = null;

async function send(logObj: any, readData: [any]) {
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
  // 清除数据
  fs.writeFile(LOGGER_LOG_PATH, '', 'utf8', () => {
    // resolve();
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
    console.log('send success');
  }
}
async function report(logObj?: any) {
  let readData = fs.readFileSync(LOGGER_LOG_PATH, 'utf-8');
  if (readData) {
    readData = readData.split('\n');
    // 数量太少暂时不上报
    if (readData.length < 20) {
      if (!timer) {
        timer = setTimeout(async () => {
          await send(logObj, readData);
          timer && clearTimeout(timer);
          timer = null;
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
