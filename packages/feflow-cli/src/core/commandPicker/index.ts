// NOTE
// CommandPicker是一个中间层，接收到当前用户执行的命令后，注册对应的执行器，并执行。

// 维护一套命令和插件路径的映射文件.feflowCache，命令被激活后才注册，然后调用。

// .feflowCache 存命令和对应插件路径的映射关系
// 下指配置文件
import path from 'path';
import fs from 'fs';
import { parseYaml, safeDump } from '../../shared/yaml';
import { CACHE_FILE } from '../../shared/constant';
import chalk from 'chalk';

const internalPlugins = {
  devtool: '@feflow/feflow-plugin-devtool'
};

export default class CommandPicker {
  cache: any;
  root: string;
  cmd: string;
  ctx: any;
  cacheFilePath: string;
  isHelp: boolean;

  constructor(ctx: any, cmd: string) {
    this.cache = {};
    this.root = ctx.root;
    this.ctx = ctx;
    this.cmd = cmd;
    this.cacheFilePath = path.join(this.root, CACHE_FILE);
    this.isHelp = ctx.args.h || ctx.args.help;

    this.init();

    if (this.isHelp) {
      this.cmd = 'help';
      this.pickCommand();
    }
  }

  isAvailable() {
    return this.isHelp ? false : !!this.getCommandConfig();
  }

  async init() {
    this.checkAndUpdate();
  }

  checkAndUpdate() {
    const { cacheFilePath } = this;
    if (!fs.existsSync(cacheFilePath)) {
      this.initCacheFile(cacheFilePath);
    } else {
      this.cache = parseYaml(cacheFilePath);
    }

    const { token: versionFromCache } = this.cache;
    if (!this.checkCacheToken(versionFromCache)) {
      this.initCacheFile(cacheFilePath);
    }
  }

  checkCacheToken(tokenFromCache: string) {
    return tokenFromCache === this.ctx.version;
  }

  getCacheToken() {
    return this.ctx.version;
  }

  initCacheFile(filePath: string) {
    const cacheObj: any = {};
    cacheObj.commandPickerMap = this.initCommandPickerMap();
    cacheObj.token = this.getCacheToken();
    safeDump(cacheObj, filePath);
    this.cache = cacheObj;
  }

  getCommandConfig() {
    return this.cache?.commandPickerMap?.[this.cmd];
  }

  initCommandPickerMap() {
    const commandPickerMap = {};
    const nativePath = path.join(__dirname, '../native');

    // load native command
    fs.readdirSync(nativePath)
      .filter((file) => {
        return file.endsWith('.js');
      })
      .forEach((file) => {
        const command = file.split('.')[0];
        commandPickerMap[command] = {
          path: path.join(__dirname, '../native', file),
          type: 'native'
        };
      });

    // load internal plugins
    for (const command of Object.keys(internalPlugins)) {
      commandPickerMap[command] = {
        path: internalPlugins[command],
        type: 'plugin'
      };
    }

    return commandPickerMap;
  }
  // 从配置文件中获取到当前命令的插件路径，然后注册进入commander
  pickCommand() {
    console.log('pickCommand');
    const { path, type } = this.getCommandConfig();
    switch (type) {
      case 'native':
      case 'plugin': {
        try {
          require(path)(this.ctx);
        } catch (error) {
          this.ctx.logger.error(
            { err: error },
            'command load failed: %s',
            chalk.magenta(name)
          );
        }
        break;
      }
      case 'universal_plugin': {
        break;
      }
      default: {
      }
    }
  }
}
