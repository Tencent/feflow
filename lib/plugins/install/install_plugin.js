'use strict';

const _ = require('lodash');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const osenv = require('osenv');
const Table = require('easy-table');
const rp = require('request-promise');
const co = require('co');
const install = require('../../utils/index').install;
const homeDir = osenv.home();
const feflowHome = path.join(homeDir, './.feflow');

class Plugin {

  /**
   * 获取某个插件的版本
   * @private
   */
  _getCurrentVersion(pluginName) {

    const feflowModules = path.join(feflowHome, 'node_modules');

    const pkgJsonPath = path.join(feflowModules, pluginName, 'package.json');

    if (fs.existsSync(pkgJsonPath)) {
      const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

      return pkgJson.version;
    } else {
      return null;
    }
  }

  /**
   * 根据npm 的 registry机制 查询某个npm包最新的版本和当前版本
   */
  _getVersion(module) {
    const self = this;

    const REGISTRY_URL = `http://r.tnpm.oa.com/${module}/latest`;

    return new Promise(function (resolve, reject) {

      const options = {
        url: REGISTRY_URL,
        method: 'GET'
      };

      rp(options)
        .then((response) => {
          // 查询成功
          response = JSON.parse(response);
          const latestVersion = response && response.version;
          const description = response && response.description;
          const currentVersion = self._getCurrentVersion(module);
          resolve({
            success: true,
            data: {
              latestVersion: latestVersion,
              currentVersion: currentVersion,
              module: module,
              description: description
            }
          })
        })
        .catch((err) => {
          // 查询失败
          resolve({
            success: false,
            msg: err && err.message
          });
        });
    });
  }

  /**
   * 检查是否需要提示开发者升级信息
   * @param modules {Array}  安装包列表
   */
  *_checkUpgrade(modules) {
    const table = new Table();

    const versionPromise = [];

    const needUpgrade = [];

    _.map(modules, (module) => {
      versionPromise.push(this._getVersion(module));
    });

    const versionData = yield versionPromise;

    _.map(versionData, (item) => {
      if (item.success) {
        const itemInfo = item.data;
        const { module, currentVersion, latestVersion } = itemInfo;

        if (currentVersion !== latestVersion) {
          needUpgrade.push(itemInfo);
        }

        table.cell('Name', module);
        table.cell('Version', currentVersion === latestVersion ? currentVersion : currentVersion + ' -> ' + latestVersion);
        table.cell('Tag', 'latest');
        table.cell('Update', currentVersion === latestVersion ? 'N' : 'Y');

        table.newRow();
      }
    });

    return {
      needUpgrade: needUpgrade,
      msg: table.toString()
    };
  }


  // 对外暴露的命令

  /**
   * 安装插件
   * @param modules   {Array|String}  需要安装的模块
   */
  *install(modules) {

    if (typeof modules === 'string') {
      modules = [modules];
    }

    const result = yield this._checkUpgrade(modules);

    const { needUpgrade, msg} = result;

    if (needUpgrade.length) {

      console.log(msg);

      const installResult = yield install.install(modules, feflowHome);

      if (installResult.success) {
        console.log(chalk.green('插件安装成功！'));
        return {
          success: true,
          needUpgrade: needUpgrade
        };
      }
    } else {
      console.log(chalk.green('检测到你本地安装的已经是最新版本，无需重新安装!'));
      return false;
    }
  }

}

module.exports = function (args) {
  co(function *() {
    yield new Plugin().install(args['_']);
  });
};