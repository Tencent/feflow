'use strict';

const fs = require('hexo-fs');
const pathFn = require('path');

const deleteFolderRecursive = function (path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      const curPath = path + '/' + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports = function (args) {
  const { log, baseDir, pluginDir, logDir } = this;
  const packagePath = pathFn.join(baseDir, 'package.json');

  // Remove plugin dir
  if (fs.existsSync(pluginDir) && fs.lstatSync(pluginDir).isDirectory()) {
    deleteFolderRecursive(pluginDir);
  }

  // Remove log dir
  if (fs.existsSync(logDir) && fs.lstatSync(logDir).isDirectory()) {
    deleteFolderRecursive(logDir);
  }

  // Rewrite package.json
  fs.writeFileSync(packagePath, JSON.stringify({
    'name': 'feflow-home',
    'version': '0.0.0',
    'private': true
  }, null, 4));

  log.info('Feflow 重新重新初始化完成');
};
