'use strict';
const spawnCommand = require('./spawn_command');

module.exports = function (modules, where) {
  return new Promise((resolve, reject) => {

    const args = ['install'].concat(modules).concat('--color=always');

    const tnpm = spawnCommand('tnpm', args, {cwd: where});

    // 尝试使用tnpm来安装二方包或者三方包
    let tnpmOutput = '';
    tnpm.stdout.on('data', (data) => {
      tnpmOutput += data;
    }).pipe(process.stdout);

    tnpm.stderr.on('data', (data) => {
      tnpmOutput += data;
    }).pipe(process.stderr);

    tnpm.on('close', (code) => {
      if (!code) {
        resolve({
          success: true,
          msg: 'tnpm 安装成功!',
          data: tnpmOutput
        });
        return;
      } else {
        reject({
          success: false,
          msg: 'tnpm异常退出，code: ' + code,
          data: tnpmOutput
        });
      }
    });
  });
};