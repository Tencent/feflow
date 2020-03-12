import Commander from './commander';
import Hook from './hook';
import fs from 'fs';
import inquirer from 'inquirer';
import logger from './logger';
import osenv from 'osenv';
import path from 'path';
import Table from 'easy-table';
import spawn from 'cross-spawn';
import loadPlugins from './plugin/loadPlugins';
import loadDevkits from './devkit/loadDevkits';
import { FEFLOW_ROOT } from '../shared/constant';
import { safeDump, parseYaml } from '../shared/yaml';
import packageJson from '../shared/packageJson';
import { getRegistryUrl, install } from '../shared/npm';
import chalk from 'chalk';
import semver from 'semver';
import commandLineUsage from 'command-line-usage';
import Config from './devkit/config';
const pkg = require('../../package.json');

export default class Feflow {
    public args: any;
    public projectConfig: any;
    public version: string;
    public logger: any;
    public commander: any;
    public hook: any;
    public root: any;
    public rootPkg: any;
    public config: any;
    public configPath: any;

    constructor(args: any) {
        args = args || {};
        const root = path.join(osenv.home(), FEFLOW_ROOT);
        const configPath = path.join(root, '.feflowrc.yml');
        this.root = root;
        this.rootPkg = path.join(root, 'package.json');
        this.args = args;
        this.version = pkg.version;
        this.config = parseYaml(configPath);
        this.configPath = configPath;
        this.commander = new Commander();
        this.hook = new Hook();
        this.logger = logger({
            debug: Boolean(args.debug),
            silent: Boolean(args.silent)
        });
    }

    async init(cmd: string) {
        if (cmd === 'config') {
            await this.initClient();
            await this.loadNative();
        } else {
            await this.initClient();
            await this.initPackageManager();
            await this.checkCliUpdate();
            await this.checkUpdate();
            await this.loadNative();
            await this.loadInternalPlugins();
            await loadPlugins(this);
            await loadDevkits(this);
        }
    }

    initClient() {
        const { root, rootPkg } = this;

        return new Promise<any>((resolve, reject) => {
            if (fs.existsSync(root) && fs.statSync(root).isFile()) {
                fs.unlinkSync(root);
            }

            if (!fs.existsSync(root)) {
                fs.mkdirSync(root);
            }

            if (!fs.existsSync(rootPkg)) {
                fs.writeFileSync(rootPkg, JSON.stringify({
                    'name': 'feflow-home',
                    'version': '0.0.0',
                    'private': true
                }, null, 2));
            }

            resolve();
        });
    }

    initPackageManager() {
        const { root, logger } = this;

        return new Promise<any>((resolve, reject) => {
            if (!this.config || !this.config.packageManager) {
                const isInstalled = (packageName: string) => {
                    try {
                        const ret = spawn.sync(packageName, ['-v'], { stdio: 'ignore' });
                        if (ret.status !== 0) {
                            return false;
                        }
                        return true;
                    } catch (err) {
                        return false;
                    }
                };

                const packageManagers = [
                    {
                        name: 'npm',
                        installed: isInstalled('npm')
                    },
                    {
                        name: 'tnpm',
                        installed: isInstalled('tnpm')
                    },
                    {
                        name: 'cnpm',
                        installed: isInstalled('cnpm')
                    },
                    {
                        name: 'yarn',
                        installed: isInstalled('yarn')
                    }
                ];

                const installedPackageManagers = packageManagers.filter(packageManager => packageManager.installed);

                if (installedPackageManagers.length === 0) {
                    const notify = "You must installed a package manager";
                    console.error(notify);
                } else {
                    const options = installedPackageManagers.map((installedPackageManager: any) => {
                        return installedPackageManager.name
                    });
                    inquirer.prompt([{
                        type: 'list',
                        name: 'packageManager',
                        message: 'Please select one package manager',
                        choices: options
                    }]).then((answer: any) => {
                        const configPath = path.join(root, '.feflowrc.yml');
                        safeDump(answer, configPath);
                        this.config = parseYaml(configPath);
                        resolve();
                    });
                }
                return;
            } else {
                logger.debug('Use packageManager is: ', this.config.packageManager);
            }
            resolve();
        });
    }

    checkUpdate() {
        const { root, rootPkg, config, logger } = this;
        if (!config) {
            return;
        }

        const table = new Table();
        const packageManager = config.packageManager;
        return Promise.all(this.getInstalledPlugins().map(async (name: any) => {
            const pluginPath = path.join(root, 'node_modules', name, 'package.json');
            const content: any = fs.readFileSync(pluginPath);
            const pkg: any = JSON.parse(content);
            const localVersion = pkg.version;
            const registryUrl = await getRegistryUrl(packageManager);
            const latestVersion: any = await packageJson(name, registryUrl).catch((err) => {
                logger.debug('Check plugin update error', err);
            });

            if (latestVersion && semver.gt(latestVersion, localVersion)) {
                table.cell('Name', name);
                table.cell('Version', localVersion === latestVersion ? localVersion : localVersion + ' -> ' + latestVersion);
                table.cell('Tag', 'latest');
                table.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
                table.newRow();

                return {
                    name,
                    latestVersion
                };
            } else {
                logger.debug('All plugins is in latest version');
            }
        })).then((plugins: any) => {
            plugins = plugins.filter((plugin: any) => {
                return plugin && plugin.name;
            });
            if (plugins.length) {
                this.logger.info('It will update your local templates or plugins, this will take few minutes');
                console.log(table.toString());

                this.updatePluginsVersion(rootPkg, plugins);

                const needUpdatePlugins: any = [];
                plugins.map((plugin: any) => {
                    needUpdatePlugins.push(plugin.name);
                });

                return install(
                    packageManager,
                    root,
                    'install',
                    needUpdatePlugins,
                    false,
                    true
                ).then(() => {
                    this.logger.info('Plugin update success');
                });
            }
        });
    }

    updatePluginsVersion(packagePath: string, plugins: any) {
        const obj = require(packagePath);

        plugins.map((plugin: any) => {
            obj.dependencies[plugin.name] = plugin.latestVersion;
        });

        fs.writeFileSync(packagePath, JSON.stringify(obj, null, 4));
    }

    getInstalledPlugins() {
        const { root, rootPkg } = this;

        let plugins: any = [];
        const exist = fs.existsSync(rootPkg);
        const pluginDir = path.join(root, 'node_modules');

        if (!exist) {
            plugins = [];
        } else {
            const content: any = fs.readFileSync(rootPkg);

            let json: any;

            try {
                json = JSON.parse(content);
                const deps = json.dependencies || json.devDependencies || {};

                plugins = Object.keys(deps);
            } catch (ex) {
                plugins = [];
            }
        }
        return plugins.filter((name: any) => {
            if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-|generator-|^@[^/]+\/generator-/.test(name)) {
                return false;
            }
            const pathFn = path.join(pluginDir, name);
            return fs.existsSync(pathFn);
        });
    }

    loadNative() {
        return new Promise<any>((resolve, reject) => {
            const nativePath = path.join(__dirname, './native');
            fs.readdirSync(nativePath).filter((file) => {
                return file.endsWith('.js');
            }).map((file) => {
                require(path.join(__dirname, './native', file))(this);
            });
            resolve();
        });
    }

    loadInternalPlugins() {
        [
            '@feflow/feflow-plugin-devtool'
        ].map((name: string) => {
            try {
                this.logger.debug('Plugin loaded: %s', chalk.magenta(name));
                return require(name)(this);
            } catch (err) {
                this.logger.error({err: err}, 'Plugin load failed: %s', chalk.magenta(name));
            }
        });
    }


    call(name: any, ctx: any) {
        const args = ctx.args;
        if((args.h || args.help) && name != "help"){
            return this.showCommandOptionDescription(name, ctx);
        }
        return new Promise<any>((resolve, reject) => {
            const cmd = this.commander.get(name);
            if (cmd) {
                cmd.call(this, ctx);
            } else {
                reject(new Error('Command `' + name + '` has not been registered yet!'));
            }
        });
    }

    async updateCli(packageManager: string) {
        return new Promise((resolve, reject) => {
            const args = [
                'install',
                '@feflow/cli@latest',
                '--color=always',
                '--save',
                '--save-exact',
                '--loglevel',
                'error',
                '-g'
            ];

            const child = spawn(packageManager, args, { stdio: 'inherit' });
            child.on('close', code => {
                if (code !== 0) {
                    reject({
                        command: `${packageManager} ${args.join(' ')}`,
                    });
                    return;
                }
                resolve();
            });
        })
    }

    async  checkCliUpdate() {
        const { version, config, configPath } = this;
        if (!config) {
            return;
        }
        if (config.lastUpdateCheck && (+new Date() - parseInt(config.lastUpdateCheck, 10)) <= 1000 * 3600 * 24) {
            return;
        }
        const packageManager = config.packageManager;
        const registryUrl = await getRegistryUrl(packageManager);
        const latestVersion: any = await packageJson('@feflow/cli', registryUrl).catch(() => {
            this.logger.warn(`Network error, can't reach ${ registryUrl }, CLI give up verison check.`);
        });
        if (latestVersion && semver.gt(latestVersion, version)) {
            const askIfUpdateCli = [{
                type: "confirm",
                name: "ifUpdate",
                message: `${chalk.yellow(`@feflow/cli's latest version is ${chalk.green(`${latestVersion}`)}, but your version is ${chalk.red(`${version}`)}, Do you want to update it?`)}`,
                default: true
            }]
            const answer = await inquirer.prompt(askIfUpdateCli);
            if (answer.ifUpdate) {
                await this.updateCli(packageManager);
            } else {
                safeDump({
                    ...config,
                    'lastUpdateCheck': +new Date()
                }, configPath);
            }
        }
    }

    async showCommandOptionDescription(cmd: any, ctx: any): Promise<any> {
        const config = new Config(ctx);
        const kitJson = config.getDevKitConfig(ctx, cmd);
        let cmdDescription;

        let optionDescrition: any = {
            header: 'Options',
            optionList: [],
          };;

        if (kitJson.builders) {
          const commands = kitJson.builders;
          const { optionsDescription : cmdOptionDescrition = {}, description } = commands[cmd] || {};
          cmdDescription = description;
          const optionDescritions = Object.keys(cmdOptionDescrition);

          optionDescritions.forEach(option => {
            let optionItemConfig = cmdOptionDescrition[option];
            const optionDescritionItem = this.getOptionItem(optionItemConfig, option);
            optionDescrition.optionList.push(optionDescritionItem);
          });
        }

        if(optionDescrition.optionList.length == 0) {
            return this.call("help", ctx)
        }

        const sections = [];
        sections.push({
            header: `fef ${cmd}`,
            content: cmdDescription
        })
        sections.push({
            header: 'Usage',
            content: `$ fef ${cmd} [options]`
        })
        sections.push(optionDescrition);
        const usage = commandLineUsage(sections);

        console.log(usage);
    }

    getOptionItem(optionItemConfig: any, option: any): object {
        let optionDescritionItem = {};
        if (typeof optionItemConfig == 'string') {
            optionDescritionItem = {
                name: option,
                description: optionItemConfig,
            };
        } else {
            const { name, description, alias, type, typeLabel } = optionItemConfig;
            optionDescritionItem = {
                name,
                description,
                alias,
                typeLabel,
                type: /boolean/i.test(type) ? Boolean : String,
            };
        }
        return optionDescritionItem;
    };
}