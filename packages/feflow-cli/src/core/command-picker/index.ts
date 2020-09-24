import fs from 'fs';
import path from 'path';
import osenv from 'osenv';
import chalk from 'chalk';
import { parseYaml, safeDump } from '../../shared/yaml';
import { CACHE_FILE, FEFLOW_ROOT } from '../../shared/constant';
import { getPluginsList } from '../plugin/loadPlugins';
import _ from 'lodash';
import Feflow from '..';
import { execPlugin } from '../plugin/loadUniversalPlugin';

const internalPlugins = {
  devtool: '@feflow/feflow-plugin-devtool'
};

export enum COMMAND_TYPE {
  NATIVE_TYPE = 'native',
  PLUGIN_TYPE = 'plugin',
  INTERNAL_PLUGIN_TYPE = 'devtool',
  UNIVERSAL_PLUGIN_TYPE = 'universal',
  UNKNOWN_TYPE = 'unknown'
}

export const LOAD_PLUGIN = 1 << 0;
export const LOAD_DEVKIT = 1 << 1;
export const LOAD_UNIVERSAL_PLUGIN = 1 << 2;
export const LOAD_ALL = LOAD_PLUGIN | LOAD_DEVKIT | LOAD_UNIVERSAL_PLUGIN;

type PluginItem = {
  commands: Array<{
    name: string;
    path?: string;
    version?: string;
  }>;
  path?: string;
  type: COMMAND_TYPE;
};

type PluginInfo = {
  [key: string]: PluginItem;
};

type PickMap = {
  [COMMAND_TYPE.PLUGIN_TYPE]?: PluginInfo;
  [COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE]?: PluginInfo;
  [COMMAND_TYPE.NATIVE_TYPE]: PluginInfo;
  [COMMAND_TYPE.INTERNAL_PLUGIN_TYPE]: PluginInfo;
};

type Cache = {
  commandPickerMap: PickMap;
  version: string;
};

type TargetPlugin = {
  path: string;
  type: COMMAND_TYPE;
};

type TargetUniversalPlugin = {
  type: COMMAND_TYPE;
  version: string;
  pkg: string;
};

export class CommandPickConfig {
  ctx: Feflow;
  cache: Cache | undefined;
  lastCommand = '';
  lastStore: Record<string, { pluginName: string }> = {};
  subCommandMap: { [key: string]: string[] } = {};
  subCommandMapWithVersion: {
    [key: string]: { name: string; version: string };
  } = {};
  root: string;
  cacheFilePath: string;
  cacheVersion = '1.0.0';

  PICK_ORDER = [
    COMMAND_TYPE.PLUGIN_TYPE,
    COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE,
    COMMAND_TYPE.NATIVE_TYPE,
    COMMAND_TYPE.INTERNAL_PLUGIN_TYPE
  ];

  constructor(ctx: Feflow) {
    this.ctx = ctx;
    this.root = path.join(osenv.home(), FEFLOW_ROOT);
    this.cacheFilePath = path.join(this.root, CACHE_FILE);
    this.cache = this.getCache();
    if (!this.cache) {
      this.ctx.logger.debug('command picker is empty');
    } else {
      const isCacheExpried = this.cache.version !== this.cacheVersion;
      if (isCacheExpried) {
        this.ctx.logger.debug('fef cache is expried, clear invalid cache.');
        this.cache = {
          version: this.cacheVersion
        } as Cache;
        this.writeCache();
      }
    }
  }

  registSubCommand(
    type: COMMAND_TYPE,
    store: Record<string, any>,
    pluginName: string = COMMAND_TYPE.NATIVE_TYPE,
    version = 'latest'
  ) {
    const newCommands = _.difference(
      Object.keys(store),
      Object.keys(this.lastStore)
    );

    if (!!this.lastCommand) {
      if (type == COMMAND_TYPE.PLUGIN_TYPE) {
        // 命令相同的场景，插件提供方变化后，依然可以探测到是新命令
        const commonCommands = Object.keys(store).filter(
          (item) => !newCommands.includes(item)
        );
        for (const common of commonCommands) {
          if (!this.lastStore[common]) continue;
          if (store[common].pluginName !== this.lastStore[common].pluginName) {
            newCommands.push(common);
          }
        }
        this.subCommandMap[this.lastCommand] = newCommands;
      } else {
        this.subCommandMapWithVersion[this.lastCommand] = {
          name: newCommands[0],
          version
        };
      }
    }

    this.lastCommand = pluginName;
    this.lastStore = Object.assign({}, store);
  }

  initCacheFile() {
    this.cache = {
      commandPickerMap: this.getAllCommandPickerMap() as PickMap,
      version: this.cacheVersion
    };
    this.writeCache();
  }

  writeCache(filePath = this.cacheFilePath) {
    safeDump(this.cache as Cache, filePath);
  }

  updateCache(type: COMMAND_TYPE) {
    if (!this.cache?.commandPickerMap) {
      this.initCacheFile();
      return;
    }

    if (type === COMMAND_TYPE.PLUGIN_TYPE) {
      this.cache.commandPickerMap[type] = this.getPluginMap();
    } else if (type === COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE) {
      this.cache.commandPickerMap[type] = this.getUniversalMap();
    }

    this.writeCache();

    this.lastStore = {};
    this.lastCommand = '';
  }

  getAllCommandPickerMap(): Partial<PickMap> {
    const commandPickerMap: Partial<PickMap> = {};
    commandPickerMap[COMMAND_TYPE.NATIVE_TYPE] = this.getNativeMap();
    commandPickerMap[COMMAND_TYPE.PLUGIN_TYPE] = this.getPluginMap();

    commandPickerMap[
      COMMAND_TYPE.INTERNAL_PLUGIN_TYPE
    ] = this.getInternalPluginMap();

    commandPickerMap[
      COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE
    ] = this.getUniversalMap();

    return commandPickerMap;
  }

  getNativeMap(): PluginInfo {
    const nativePath = path.join(__dirname, '../native');
    const nativeMap: PluginInfo = {};
    fs.readdirSync(nativePath)
      .filter((file) => {
        return file.endsWith('.js');
      })
      .forEach((file) => {
        const command = file.split('.')[0];
        nativeMap[command] = {
          commands: [
            {
              name: command
            }
          ],
          path: path.join(__dirname, '../native', file),
          type: COMMAND_TYPE.NATIVE_TYPE
        };
      });
    return nativeMap;
  }

  getInternalPluginMap(): PluginInfo {
    const devtool: PluginInfo = {};
    for (const command of Object.keys(internalPlugins)) {
      devtool[command] = {
        path: internalPlugins[command],
        type: COMMAND_TYPE.INTERNAL_PLUGIN_TYPE,
        commands: [{ name: 'devtool' }]
      };
    }
    return devtool;
  }

  getPluginMap(): PluginInfo {
    const plugin: PluginInfo = {};
    const [err, pluginList] = getPluginsList(this.ctx);
    const home = path.join(osenv.home(), FEFLOW_ROOT);

    if (!Object.keys(this.subCommandMap).length) {
      return plugin;
    }

    if (!err) {
      for (const pluginNpm of pluginList) {
        const pluginPath = path.join(home, 'node_modules', pluginNpm);
        // TODO
        // read plugin command from the key which from its package.json
        plugin[pluginNpm] = {
          type: COMMAND_TYPE.PLUGIN_TYPE,
          commands:
            this.subCommandMap[pluginNpm] &&
            this.subCommandMap[pluginNpm].map((cmd: string) => ({
              name: cmd
            })),
          path: pluginPath
        };
      }
    } else {
      this.ctx.logger.debug('picker load plugin failed', err);
    }
    return plugin;
  }

  getUniversalMap(): PluginInfo {
    const unversalPlugin: PluginInfo = {};
    for (let pkg of Object.keys(this.subCommandMapWithVersion)) {
      if (!pkg) continue;
      const { name, version } = this.subCommandMapWithVersion[pkg];
      unversalPlugin[pkg] = {
        commands: [{ name, version }],
        type: COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE
      };
    }
    return unversalPlugin;
  }

  getCache(): Cache | undefined {
    const { cacheFilePath } = this;
    let localCache: Cache | undefined;
    try {
      localCache = parseYaml(cacheFilePath) as Cache;
    } catch (error) {
      this.ctx.logger.debug('.feflowCache.yml parse err ', error);
    }
    return localCache;
  }

  removeCache(name: string) {
    if (!this.cache) return;
    const commandPickerMap = this.cache.commandPickerMap;
    let targetPath = { type: '', plugin: '' };

    for (let type of this.PICK_ORDER) {
      const pluginsInType = commandPickerMap[type];
      if (!pluginsInType) continue;
      for (let plugin of Object.keys(pluginsInType as PluginInfo)) {
        if (name === plugin) {
          targetPath = {
            type,
            plugin
          };
        }
      }

      if (targetPath.type) {
        break;
      }
    }

    delete this.cache.commandPickerMap[targetPath.type][targetPath.plugin];
    this.writeCache();
  }

  // 获取命令的缓存目录
  getCommandPath(cmd: string): TargetPlugin | TargetUniversalPlugin {
    let target: TargetPlugin | TargetUniversalPlugin = {
      type: COMMAND_TYPE.UNKNOWN_TYPE,
      path: ''
    };
    if (!this.cache?.commandPickerMap) return target as TargetPlugin;
    const commandPickerMap = this.cache.commandPickerMap;

    for (let type of this.PICK_ORDER) {
      const pluginsInType = commandPickerMap[type];
      if (!pluginsInType) continue;
      for (let plugin of Object.keys(pluginsInType as PluginInfo)) {
        const { commands, path, type } = pluginsInType[plugin] as PluginItem;
        commands?.forEach(({ name, path: cmdPath, version }) => {
          if (cmd === name) {
            if (type === COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE) {
              (target as TargetUniversalPlugin).version = version as string;
              (target as TargetUniversalPlugin).pkg = plugin;
              (target as TargetUniversalPlugin).type = type;
            } else {
              (target as TargetPlugin).type = type;
              (target as TargetPlugin).path = (cmdPath || path) as string;
            }
          }
        });
      }

      if (target.type !== COMMAND_TYPE.UNKNOWN_TYPE) {
        break;
      }
    }
    return target;
  }
}

export default class CommandPicker {
  root: string;
  cmd: string;
  ctx: any;
  isHelp: boolean;
  cacheController: CommandPickConfig;
  SUPPORT_TYPE = [
    COMMAND_TYPE.NATIVE_TYPE,
    COMMAND_TYPE.PLUGIN_TYPE,
    COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE,
    COMMAND_TYPE.INTERNAL_PLUGIN_TYPE
  ];

  constructor(ctx: any, cmd: string = 'help') {
    this.root = ctx.root;
    this.ctx = ctx;
    this.cmd = cmd;
    this.isHelp = cmd === 'help' || ctx.args.h || ctx.args.help;
    this.cacheController = new CommandPickConfig(ctx);
  }

  loadHelp() {
    this.cmd = 'help';
    this.pickCommand();
  }

  isAvailable() {
    const tartgetCommand = this.cacheController.getCommandPath(this.cmd);
    const { type } = tartgetCommand;

    if (type === COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE) {
      const { version } = tartgetCommand as TargetUniversalPlugin;
      return !this.isHelp && !!version;
    } else {
      const { path } = tartgetCommand as TargetPlugin;
      const pathExists = fs.existsSync(path);
      const isCachType = this.SUPPORT_TYPE.includes(type);
      return !this.isHelp && !!pathExists && isCachType;
    }
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
    const tartgetCommand = this.cacheController.getCommandPath(this.cmd);
    const { type } = tartgetCommand;

    this.ctx.logger.debug('pick command type: ', type);
    if (!this.SUPPORT_TYPE.includes(type)) {
      return this.ctx.logger.error(
        `this kind of command is not supported in command picker, ${type}`
      );
    }

    if (type === COMMAND_TYPE.UNIVERSAL_PLUGIN_TYPE) {
      const { version, pkg } = tartgetCommand as TargetUniversalPlugin;
      execPlugin(this.ctx, pkg, version);
    } else {
      const { path } = tartgetCommand as TargetPlugin;
      const commandSource =
        this.getCommandSource(path) || COMMAND_TYPE.NATIVE_TYPE;
      this.ctx.logger.debug('pick command path: ', path);
      this.ctx.logger.debug('pick command source: ', commandSource);

      try {
        this.ctx?.reporter?.setCommandSource(commandSource);
        require(path)(this.ctx);
      } catch (error) {
        this.ctx.logger.error(
          { err: error },
          'command load failed: %s',
          chalk.magenta(error)
        );
      }
    }
  }

  getLoadOrder() {
    return LOAD_ALL;
  }
}
