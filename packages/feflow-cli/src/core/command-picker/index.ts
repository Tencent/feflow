import fs from 'fs';
import path from 'path';
import osenv from 'osenv';
import chalk from 'chalk';
import { parseYaml, safeDump } from '../../shared/yaml';
import { CACHE_FILE, FEFLOW_ROOT } from '../../shared/constant';
import { getPluginsList } from '../plugin/loadPlugins';

const internalPlugins = {
  devtool: '@feflow/feflow-plugin-devtool'
};

const NATIVE_TYPE = 'native';
const PLUGIN_TYPE = 'plugin';

const pluginRegex = new RegExp('feflow-plugin-(.*)', 'i');

export const LOAD_PLUGIN = 1 << 0;
export const LOAD_DEVKIT = 1 << 1;
export const LOAD_UNIVERSAL_PLUGIN = 1 << 2;
export const LOAD_ALL = LOAD_PLUGIN | LOAD_DEVKIT | LOAD_UNIVERSAL_PLUGIN;

export default class CommandPicker {
  cache: any;
  root: string;
  cmd: string;
  ctx: any;
  cacheFilePath: string;
  isHelp: boolean;

  constructor(ctx: any, cmd: string = 'help') {
    this.cache = {};
    this.root = ctx.root;
    this.ctx = ctx;
    this.cmd = cmd;
    this.cacheFilePath = path.join(this.root, CACHE_FILE);
    this.isHelp = cmd === 'help' || ctx.args.h || ctx.args.help;

    this.init();

    if (this.isHelp) {
      this.loadHelp();
    }
  }

  loadHelp() {
    this.cmd = 'help';
    this.pickCommand();
  }

  isAvailable() {
    const { path, type } = this.getCommandConfig() || {};
    const pathExists = fs.existsSync(path);
    const isCachType = type === NATIVE_TYPE || type === PLUGIN_TYPE;
    return !this.isHelp && !!pathExists && isCachType;
  }

  private init() {
    this.checkAndUpdate();
  }

  checkAndUpdate() {
    const { cacheFilePath } = this;
    if (!fs.existsSync(cacheFilePath)) {
      this.initCacheFile(cacheFilePath);
    } else {
      try {
        this.cache = parseYaml(cacheFilePath);
      } catch (error) {
        this.ctx.logger.debug('.feflowCache.yml parse err');
        this.initCacheFile(cacheFilePath);
      }
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
    return this.cache.commandPickerMap?.[this.cmd];
  }

  initCommandPickerMap() {
    const commandPickerMap = {};
    const nativePath = path.join(__dirname, '../native');
    const logger = this.ctx.logger;

    // load native command
    fs.readdirSync(nativePath)
      .filter((file) => {
        return file.endsWith('.js');
      })
      .forEach((file) => {
        const command = file.split('.')[0];
        commandPickerMap[command] = {
          path: path.join(__dirname, '../native', file),
          type: NATIVE_TYPE
        };
      });

    // load internal plugins
    for (const command of Object.keys(internalPlugins)) {
      commandPickerMap[command] = {
        path: internalPlugins[command],
        type: PLUGIN_TYPE
      };
    }

    // load plugins
    const [err, plugins] = getPluginsList(this.ctx);
    const home = path.join(osenv.home(), FEFLOW_ROOT);

    if (!err) {
      for (const plugin of plugins) {
        const pluginPath = path.join(home, 'node_modules', plugin);
        // TODO
        // read plugin command from the key which from its package.json
        const command = (pluginRegex.exec(plugin) || [])[1];
        commandPickerMap[command] = {
          path: pluginPath,
          type: PLUGIN_TYPE
        };
      }
    } else {
      logger.debug('picker load plugin failed', err);
    }

    return commandPickerMap;
  }

  checkCommand() {
    const fn = this.ctx?.commander.get(this.cmd);
    if (!fn) {
      this.loadHelp();
    }
  }

  getCommandSource(path: string): string {
    let reg = /node_modules\/(.*)/;
    const commandSource = (reg.exec(path) || [])[1];
    return commandSource;
  }

  pickCommand() {
    const { path, type } = this.getCommandConfig() || {};
    this.ctx.logger.debug('pick command type', type);
    this.ctx.logger.debug('pick command path', path);
    const commandSource = this.getCommandSource(path) || NATIVE_TYPE;

    switch (type) {
      case NATIVE_TYPE:
      case PLUGIN_TYPE: {
        try {
          this.ctx.reporter?.setCommandSource(commandSource);
          require(path)(this.ctx);
        } catch (error) {
          this.ctx.logger.error(
            { err: error },
            'command load failed: %s',
            chalk.magenta(error)
          );
        }
        break;
      }
      default: {
        this.ctx.logger.error(
          `this kind of command is not supported in command picker, ${type}`
        );
      }
    }
  }

  isUniverslPlugin() {
    const universalpluginList = this.ctx.universalPkg.getInstalled();
    const commandList = [];
    let isHited = false;

    for (const universal of universalpluginList) {
      const command = (pluginRegex.exec(universal[0]) || [])[1];
      commandList.push(command);
    }

    isHited = commandList.includes(this.cmd);
    this.ctx.logger.debug(
      `picker: this command ${isHited ? 'is' : 'is not'} universal plugin`
    );
    return isHited;
  }

  getLoadOrder() {
    if (this.isUniverslPlugin()) {
      return LOAD_UNIVERSAL_PLUGIN;
    } else {
      return LOAD_ALL
    }
  }
}
