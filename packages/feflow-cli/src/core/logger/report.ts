const fs = require('fs');
const axios = require('axios');
const path = require('path');
const pkg = require('../../../package.json');
const PLUGE_NAME = 'feflow-' + pkg.name.split('/').pop();

const LOGGER_LOG_PATH = path.join(__dirname, '../../../logger.log');
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
        const response = await axios.post('http://test.feflowjs.com/api/v1/log/save', {
          plugin: PLUGE_NAME,
          data: JSON.stringify(writeData)
        });
        if(response.status===204){
            writeData = [];
        }
        resolve();
      }
      //非定时||上报数量过少 => 写入文件
      fs.writeFile(LOGGER_LOG_PATH, JSON.stringify(writeData), 'utf8', () => {
        resolve();
      });
    });
  }
}

export default loggerReport;
