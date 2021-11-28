/* eslint-disable @typescript-eslint/no-require-imports */
import path from 'path';
import glob from 'glob';
import Report from '@feflow/report';
import commandLineUsage from 'command-line-usage';
import minimist from 'minimist';

import Commander from './commander';
import Hook from './hook';
import createLogger, { Logger } from './logger';
import CommandPicker, { LOAD_ALL, LOAD_DEVKIT, LOAD_PLUGIN, LOAD_UNIVERSAL_PLUGIN } from './command-picker';
import { checkUpdate } from './resident';
import loadPlugins from './plugin/load-plugins';
import loadUniversalPlugin from './plugin/load-universal-plugin';
import loadDevkits from './devkit/load-devkits';
import getCommandLine from './devkit/command-options';
import Binp from './universal-pkg/binp';
import { UniversalPkg } from './universal-pkg/dep/pkg';

import {
  FEFLOW_BIN,
  FEFLOW_HOME,
  FEFLOW_LIB,
  HOOK_TYPE_ON_COMMAND_REGISTERED,
  LOG_FILE,
  UNIVERSAL_MODULES,
  UNIVERSAL_PKG_JSON,
} from '../shared/constant';
import { parseYaml, safeDump } from '../shared/yaml';
import { FefError } from '../shared/fef-error';
import { setServerUrl } from '../shared/git';
import { mkdirAsync, readFileAsync, statAsync, unlinkAsync, writeFileAsync } from '../shared/fs';
import { isInstalledPM } from '../shared/npm';
import { FeflowConfig, isValidConfig } from '../shared/type-predicates';
import pkgJson from '../../package.json';

export default class Feflow {
  public args: minimist.ParsedArgs;
  public root: string;
  public rootPkg: string;
  public configPath: string;
  public bin: string;
  public lib: string;
  public loggerPath: string;
  public universalPkgPath: string;
  public universalModules: string;
  public version: string;
  public logger: Logger;
  public commander: Commander;
  public hook: Hook;
  public config?: Partial<FeflowConfig>;
  public universalPkg: UniversalPkg;
  public reporter: Report;
  public commandPick: CommandPicker | null;
  public fefError: FefError;
  public cmd?: string;
  public projectPath?: string;
  public projectConfig?: object;
  public pkgConfig?: {
    name: string;
  };

  constructor(args: minimist.ParsedArgs) {
    this.root = FEFLOW_HOME;
    this.configPath = path.join(FEFLOW_HOME, '.feflowrc.yml');
    this.bin = path.join(FEFLOW_HOME, FEFLOW_BIN);
    this.lib = path.join(FEFLOW_HOME, FEFLOW_LIB);
    this.rootPkg = path.join(FEFLOW_HOME, 'package.json');
    this.loggerPath = path.join(FEFLOW_HOME, LOG_FILE);
    this.universalPkgPath = path.join(FEFLOW_HOME, UNIVERSAL_PKG_JSON);
    this.universalModules = path.join(FEFLOW_HOME, UNIVERSAL_MODULES);
    this.args = args;
    this.version = pkgJson.version;
    const config = parseYaml(this.configPath);
    isValidConfig(config) && (this.config = config) && setServerUrl(config.serverUrl);
    this.hook = new Hook();
    this.commander = new Commander((cmdName: string) => {
      this.hook.emit(HOOK_TYPE_ON_COMMAND_REGISTERED, cmdName);
    });
    this.logger = createLogger({
      name: 'feflow-cli',
      debug: Boolean(args.debug),
      silent: Boolean(args.silent),
    });
    this.reporter = new Report(this);
    this.universalPkg = new UniversalPkg(this.universalPkgPath);
    this.commandPick = null;
    this.fefError = new FefError(this);
  }

  async init(cmd?: string) {
    this.reporter.init(cmd);

    await Promise.all([this.initClient(), this.initPackageManager(), this.initBinPath()]);

    const disableCheck = this.args['disable-check'] || this.config?.disableCheck;
    if (!disableCheck) {
      await checkUpdate(this);
    }

    this.commandPick = new CommandPicker(this, cmd);

    if (this.commandPick.isAvailable()) {
      // should hit the cache in most cases
      this.logger.debug('find cmd in cache');
      this.commandPick.pickCommand();
      await this.loadCommands(LOAD_DEVKIT);
    } else {
      // if not, load plugin/devkit/native in need
      this.logger.debug('not find cmd in cache');
      await this.loadCommands(this.commandPick.getLoadOrder());
      // make sure the command has at least one function, otherwise replace to help command
      this.commandPick.checkCommand();
    }
  }

  async initClient() {
    const { rootPkg } = this;
    let pkgInfo = null;
    try {
      await statAsync(rootPkg);
      pkgInfo = await readFileAsync(rootPkg);
    } catch (e) {}
    if (!pkgInfo) {
      await writeFileAsync(
        rootPkg,
        JSON.stringify(
          {
            name: 'feflow-home',
            version: '0.0.0',
            private: true,
          },
          null,
          2,
        ),
      );
    }
  }

  async initBinPath() {
    const { bin } = this;
    try {
      const stats = await statAsync(bin);
      if (!stats.isDirectory()) {
        await unlinkAsync(bin);
      }
    } catch (e) {
      await mkdirAsync(bin);
    }
    new Binp().register(bin);
  }

  initPackageManager() {
    const { root, logger } = this;
    return new Promise<void>((resolve) => {
      if (!this.config?.packageManager) {
        const packageManagers = ['npm', 'tnpm', 'yarn', 'cnpm'];
        const defaultPackageManager = packageManagers.find((packageManager) => isInstalledPM(packageManager));
        if (!defaultPackageManager) {
          // 无包管理器直接结束
          logger.error('You must installed a package manager');
          return;
        }
        const configPath = path.join(root, '.feflowrc.yml');
        const config = Object.assign({}, parseYaml(configPath), {
          packageManager: defaultPackageManager,
        });
        safeDump(config, configPath);
        this.config = config;
      } else {
        logger.debug('Use packageManager is: ', this.config.packageManager);
      }
      resolve();
    });
  }

  loadNative() {
    const nativePath = path.join(__dirname, './native/*.js');
    glob.sync(nativePath).forEach((file: string) => {
      require(file)(this);
    });
  }

  async loadCommands(orderType: number) {
    this.logger.debug('load order: ', orderType);
    if ((orderType & LOAD_ALL) === LOAD_ALL) {
      this.loadNative();
      loadUniversalPlugin(this);
      await loadPlugins(this);
      loadDevkits(this);
      return;
    }
    if ((orderType & LOAD_PLUGIN) === LOAD_PLUGIN) {
      await loadPlugins(this);
    }
    if ((orderType & LOAD_UNIVERSAL_PLUGIN) === LOAD_UNIVERSAL_PLUGIN) {
      loadUniversalPlugin(this);
    }
    if ((orderType & LOAD_DEVKIT) === LOAD_DEVKIT) {
      loadDevkits(this);
    }
  }

  loadInternalPlugins() {
    const devToolPlugin = '@feflow/feflow-plugin-devtool';
    try {
      this.logger.debug('Plugin loaded: %s', devToolPlugin);
      return require(devToolPlugin)(this);
    } catch (err) {
      this.fefError.printError({
        error: err,
        msg: 'internal plugin load failed: %s',
      });
    }
  }

  async invoke(name: string | undefined, ctx: Feflow) {
    if (this.args.help && name) {
      await this.showCommandOptionDescription(name, ctx);
    }
    const cmd = this.commander.get(name);
    if (cmd) {
      this.logger.name = cmd.pluginName;
      await cmd.runFn.call(this, ctx);
    } else {
      this.logger.debug(`Command ' ${name} ' has not been registered yet!`);
    }
  }

  async showCommandOptionDescription(cmd: string, ctx: Feflow) {
    const registeredCommand = ctx.commander.get(cmd);
    let commandLine: object[] = [];

    if (registeredCommand?.options) {
      commandLine = getCommandLine(registeredCommand.options, registeredCommand.desc, cmd);
    }
    // 有副作用，暂无好方法改造
    if (cmd === 'help' && registeredCommand) {
      registeredCommand.runFn.call(this, ctx);
      return true;
    }
    if (commandLine.length === 0) {
      return false;
    }

    const sections = [];
    sections.push(...commandLine);
    const usage = commandLineUsage(sections);
    console.log(usage);
    return true;
  }
}
