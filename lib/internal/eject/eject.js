const Config = require('../build/config');
const Builder = require('../build/builder').default;
const path = require('path');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const os = require('os');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const cyan = chalk.cyan;

class Eject {
  constructor(ctx, args) {
    this.ctx = ctx;
    this.args = args;
    this.log = ctx.log;
    this.appPath = process.cwd();
  }

  // 从这开始！
  start() {
    const log = this.log;
    this.checkBuilderInstall()
      .then(() => {
        this.copyConfigFile();
        this.updateDependencies();
        this.updateNPMScript();
        return inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirmInstall',
            message: '你需要自动npm install吗？',
            default: false
          }
        ]);
      })
      .then(answer => {
        if (!answer.confirmInstall) {
          log.info(`请不要忘了npm install，如果不成功，请尝试删除${cyan('node_modules')}和${cyan('package-lock.json')}后再试`);
          return;
        }
        return this.installPackages();
      })
      .then(() => {
        log.info('Eject process completed, Happy Coding! 👊');
      })
      .catch((err) => {
        log.error('Ops, we have some problems here 👀，错误信息', err);
      });
  }

  // 这里仅仅利用Builder类去检查本地是否有安装对应builder
  checkBuilderInstall() {
    const type = Config.getBuilderType();
    this.log.info(`检查是否已经安装了最新的${type}构建器`);
    const builder = new Builder(this.ctx);
    return builder.runBuild();
  }

  // 复制builder文件
  copyConfigFile() {
    const { pluginDir } = this.ctx;
    const appPath = this.appPath;
    const type = Config.getBuilderType();
    const configPath = path.join(pluginDir, type);
    this.configPath = configPath;
    // console.log("配置所在位置", this.configPath);
    const verifyDir = this.verifyDir.bind(this);
    verifyDir('config', '项目根目录');
    this.log.info(`从${this.configPath}中复制builder配置`);
    fs.mkdirSync(path.join(appPath, 'config'));
    fs.copySync(path.join(configPath, 'lib'), path.join(this.appPath, 'config'));
    const startFile = path.join(__dirname, './template/start.js');
    verifyDir(startFile, 'builder目录');
    fs.copySync(startFile, path.join(this.appPath, 'config/start.js'));
  }

  // 检查目录/文件是否存在
  verifyDir(file, errPath) {
    const appPath = this.appPath;
    if (fs.existsSync(path.join(appPath, file))) {
      this.log.error(
        `\`${file}\` 已经存在于${errPath}，` + '请删除或者备份这个文件/目录'
      );
      process.exit(1);
    }
  }

  // 更改package.json中依赖和npm script
  updateDependencies() {
    const ownPath = this.configPath;
    const appPath = this.appPath;
    this.log.info(cyan('更新package.json依赖'));
    const ownPackage = require(path.join(ownPath, 'package.json'));
    const appPackage = require(path.join(appPath, 'package.json'));
    // console.log('ownPackage', ownPackage);
    // console.log('appPackage', appPackage);

    // 移除对builder的依赖
    const ownPackageName = ownPackage.name;
    if (appPackage.devDependencies) {
      if (appPackage.devDependencies[ownPackageName]) {
        console.log(`从 devDepencencies 中移除 ${cyan(ownPackageName)} `);
        delete appPackage.devDependencies[ownPackageName];
      }
    }
    appPackage.dependencies = appPackage.dependencies || {};
    if (appPackage.dependencies[ownPackageName]) {
      console.log(`从 dependencies 中移除 ${cyan(ownPackageName)} `);
      delete appPackage.dependencies[ownPackageName];
    }
    // 添加builder的依赖库到本地package.json
    Object.keys(ownPackage.dependencies).forEach(key => {
      // For some reason optionalDependencies end up in dependencies after install
      if (ownPackage.optionalDependencies && ownPackage.optionalDependencies[key]) {
        return;
      }
      console.log(`添加 ${cyan(key)} 到 devDependencies`);
      appPackage.devDependencies[key] = ownPackage.dependencies[key];
    });
    // 如果没有cross-env，需要加一下
    if (!appPackage.devDependencies['cross-env']) {
      console.log(`添加 ${cyan('cross-env')} 到 devDependencies`);
      appPackage.devDependencies['cross-env'] = '^5.2.0';
    }
    // 排序
    const unsortedDependencies = appPackage.dependencies;
    appPackage.dependencies = {};
    Object.keys(unsortedDependencies)
      .sort()
      .forEach(key => {
        appPackage.dependencies[key] = unsortedDependencies[key];
      });
    this.appPackage = appPackage;
  }

  // 更新npm script
  updateNPMScript() {
    this.log.info(cyan('更新 npm script'));
    const appPackage = this.appPackage;
    const appPath = this.appPath;
    // 删除eject
    delete appPackage.scripts['eject'];
    // 修改start和build
    appPackage.scripts['start'] = 'cross-env NODE_ENV=development node ./config/start.js';
    appPackage.scripts['build'] = 'cross-env NODE_ENV=production node ./config/start.js';
    fs.writeFileSync(
      path.join(appPath, 'package.json'),
      JSON.stringify(appPackage, null, 2) + os.EOL
    );
  }

  // 替用户安装依赖库(optional)
  installPackages() {
    const log = this.log;
    log.info(cyan('安装新的依赖库'));
    // 先把node_modules和package.lock.json删了，因为发现这些不删会引起npm install不成功的问题
    const packageLockJsonPath = path.join(this.appPath, 'package-lock.json');
    const nodeModulesPath = path.join(this.appPath, 'node_modules');
    console.log('package lock', packageLockJsonPath, 'node modules', nodeModulesPath);
    if (fs.existsSync(packageLockJsonPath)) {
      log.info(cyan('删除原package-lock.json'));
      fs.removeSync(packageLockJsonPath);
    }
    if (fs.existsSync(nodeModulesPath)) {
      log.info(cyan('删除原node_modules'));
      fs.removeSync(nodeModulesPath);
    }
    fs.removeSync(path.join(this.appPath, 'node_modules'));
    const {registry, proxy} = this.ctx.config;
    spawn('npm', ['install'], {
      stdio: 'inherit'
    });
    return new Promise((resolve, reject) => {
      let args = ['install', '--loglevel=error'];
      if (registry) {
        args = args.concat(`--registry=${registry}`);
      }
      if (proxy) {
        args = args.concat(`--proxy=${proxy}`);
      }
      const install = spawn('npm', args);
      let output = '';
      install.stdout.on('data', (data) => {
        output += data;
      }).pipe(process.stdout);

      install.stderr.on('data', (data) => {
        output += data;
      }).pipe(process.stderr);

      install.on('close', (code) => {
        if (!code) {
          resolve({cod: 0, data: output});
        } else {
          log.info('npm install 出错，请检查网络或者根据错误信息排除问题，再进行依赖安装');
          process.exit(1);
          reject({code: code, data: output});
        }
      });
    });
  }

}

module.exports = function (args) {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirmEject',
        message: '你确定要eject吗？此过程不可逆！',
        default: true
      }
    ])
    .then(answer => {
      if (!answer.confirmEject) {
        return;
      }
      const eject = new Eject(this, args);
      // const log = eject.ctx.log;
      eject.start();
    });
};
