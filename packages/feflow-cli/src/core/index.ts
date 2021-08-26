import path from 'path';
import glob from 'glob';
import Report from '@feflow/report';
import commandLineUsage from 'command-line-usage';

import Commander from './commander';
import Hook from './hook';
import Binp from './universal-pkg/binp';
import logger from './logger';
import loadPlugins from './plugin/loadPlugins';
import loadUniversalPlugin from './plugin/loadUniversalPlugin';
import loadDevkits from './devkit/loadDevkits';
import getCommandLine from './devkit/commandOptions';
import {
  FEFLOW_HOME,
  FEFLOW_BIN,
  FEFLOW_LIB,
  UNIVERSAL_PKG_JSON,
  UNIVERSAL_MODULES,
  HOOK_TYPE_ON_COMMAND_REGISTERED,
  LOG_FILE,
} from '../shared/constant';
import { safeDump, parseYaml } from '../shared/yaml';
import { FefError } from '../shared/fefError';
import { setServerUrl } from '../shared/git';
import { UniversalPkg } from './universal-pkg/dep/pkg';
import CommandPicker, { LOAD_UNIVERSAL_PLUGIN, LOAD_PLUGIN, LOAD_DEVKIT, LOAD_ALL } from './command-picker';
import { checkUpdate } from './resident';
import { mkdirAsync, statAsync, unlinkAsync, writeFileAsync, readFileAsync } from '../shared/fs';
import { isInstalledPM } from '../shared/npm';

const pkg = require('../../package.json');

export default class Feflow {
  public args: any;
  public cmd: any;
  public projectConfig: any;
  public projectPath: any;
  public version: string;
  public logger: any;
  public loggerPath: any;
  public commander: any;
  public hook: any;
  public root: any;
  public rootPkg: any;
  public universalPkgPath: string;
  public universalModules: string;
  public config: any;
  public configPath: any;
  public bin: string;
  public lib: string;
  public universalPkg: UniversalPkg;
  public reporter: any;
  public commandPick: CommandPicker | null;
  public fefError: FefError;

  constructor(args: any) {
    args = args || {};
    const configPath = path.join(FEFLOW_HOME, '.feflowrc.yml');
    this.root = FEFLOW_HOME;
    this.bin = path.join(FEFLOW_HOME, FEFLOW_BIN);
    this.lib = path.join(FEFLOW_HOME, FEFLOW_LIB);
    this.rootPkg = path.join(FEFLOW_HOME, 'package.json');
    this.loggerPath = path.join(FEFLOW_HOME, LOG_FILE);
    this.universalPkgPath = path.join(FEFLOW_HOME, UNIVERSAL_PKG_JSON);
    this.universalModules = path.join(FEFLOW_HOME, UNIVERSAL_MODULES);
    this.args = args;
    this.version = pkg.version;
    this.config = parseYaml(configPath);
    setServerUrl(this.config?.serverUrl);
    this.configPath = configPath;
    this.hook = new Hook();
    this.commander = new Commander((cmdName: string) => {
      this.hook.emit(HOOK_TYPE_ON_COMMAND_REGISTERED, cmdName);
    });
    this.logger = logger({
      debug: Boolean(args.debug),
      silent: Boolean(args.silent),
    });
    this.reporter = new Report(this);
    this.universalPkg = new UniversalPkg(this.universalPkgPath);
    this.commandPick = null;
    this.fefError = new FefError(this);
  }

  async init(cmd: string | undefined) {
    this.reporter.init(cmd);

    await Promise.all([this.initClient(), this.initPackageManager(), this.initBinPath()]);

    const disableCheck = this.args['disable-check'] || this.config?.disableCheck;
    if (!disableCheck) {
      checkUpdate(this);
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
      // make sure the command has at least one funtion, otherwise replace to help command
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
    return new Promise<any>((resolve, reject) => {
      if (!this.config?.packageManager) {
        const packageManagers = ['npm', 'tnpm', 'yarn', 'cnpm'];
        const defaultPackageManager = packageManagers.find((packageManager) => isInstalledPM(packageManager));
        if (!defaultPackageManager) {
          // 无包管理器直接结束
          logger.error('You must installed a package manager');
          return;
        }
        const configPath = path.join(root, '.feflowrc.yml');
        safeDump(
          Object.assign({}, parseYaml(configPath), {
            packageManager: defaultPackageManager,
          }),
          configPath,
        );
        this.config = parseYaml(configPath);
      } else {
        logger.debug('Use packageManager is: ', this.config.packageManager);
      }
      resolve();
    });
  }

  loadNative() {
    return new Promise<any>((resolve, reject) => {
      const nativePath = path.join(__dirname, './native/*.js');
      // fs.readdirSync(nativePath)
      glob.sync(nativePath).forEach((file: string) => {
        require(file)(this);
      });
      resolve();
    });
  }

  async loadCommands(orderType: number) {
    this.logger.debug('load order: ', orderType);
    if ((orderType & LOAD_ALL) === LOAD_ALL) {
      await Promise.all([this.loadNative(), loadUniversalPlugin(this), loadPlugins(this), loadDevkits(this)]);
      return;
    }
    if ((orderType & LOAD_PLUGIN) === LOAD_PLUGIN) {
      await loadPlugins(this);
    }
    if ((orderType & LOAD_UNIVERSAL_PLUGIN) === LOAD_UNIVERSAL_PLUGIN) {
      await loadUniversalPlugin(this);
    }
    if ((orderType & LOAD_DEVKIT) === LOAD_DEVKIT) {
      await loadDevkits(this);
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

  async call(name: string | undefined, ctx: any) {
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

  async showCommandOptionDescription(cmd: string, ctx: any): Promise<any> {
    const registeredCommand = ctx.commander.get(cmd);
    let commandLine: object[] = [];

    if (registeredCommand && registeredCommand.options) {
      commandLine = getCommandLine(registeredCommand.options, registeredCommand.desc, cmd);
    }
    // 有副作用，暂无好方法改造
    if (cmd === 'help') {
      registeredCommand.runFn.call(this, ctx);
      return true;
    }
    if (commandLine.length == 0) {
      return false;
    }

    const sections = [];
    sections.push(...commandLine);
    const usage = commandLineUsage(sections);
    console.log(usage);
    return true;
  }
}
