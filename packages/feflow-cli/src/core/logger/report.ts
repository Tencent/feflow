const fs = require('fs');
const axios = require('axios');
const path = require('path');
const os = require('os');
const LOGGER_LOG_PATH = path.join(__dirname, '../../../logger.log');
const KEYS_FILE = path.join(__dirname, '../../../.keys');
const USER_NAME  = os.hostname().split("-")[0];
const NOW_TIME = new Date().getTime();
let KYE_FILE = {};
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

// 保证logger.log文件一定存在
(() => {
  try {
    fs.readFileSync(LOGGER_LOG_PATH, 'utf-8');
  } catch (_) {
    fs.appendFileSync(LOGGER_LOG_PATH, '', 'utf-8');
  }
})();

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
      if (writeData.length && (writeData.length > 20 || report)) {
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
}

export default loggerReport;
