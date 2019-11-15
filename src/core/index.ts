import Commander from './commander';
import fs from 'fs';
import inquirer from 'inquirer';
import logger from './logger';
import Bunyan from 'bunyan';
import osenv from 'osenv';
import path from 'path';
import Table from 'easy-table';
import spawn from 'cross-spawn';
import loadPlugins from './plugin/loadPlugins';
import loadDevkits from './devkit/loadDevkits';
import { FEFLOW_ROOT } from '../shared/constant';
import { safeDump, parseYaml } from '../shared/yaml';
import getPackageVersion from '../shared/packageJson';
import { getRegistryUrl, install } from '../shared/npm';
const pkg = require('../../package.json');


export default class Feflow implements FeflowInterface {
    public args: Argrments;
    public projectConfig: any;
    public version: string;
    public logger: Bunyan;
    public commander: CommanderInterface;
    public root: string;
    public rootPkg: string;
    public config: Config;

    constructor(args: Argrments) {
        args = args || {};
        const root = path.join(osenv.home(), FEFLOW_ROOT);
        const configPath = path.join(root, '.feflowrc.yml');
        this.root = root;
        this.rootPkg = path.join(root, 'package.json');
        this.args = args;
        this.version = pkg.version;
        this.config = parseYaml(configPath) as Config;
        this.commander = new Commander();
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
            await this.checkUpdate();
            await this.loadNative();
            await loadPlugins(this);
            await loadDevkits(this);
        }
    }

    initClient() {
        const { root, rootPkg } = this;

        return new Promise<null>((resolve, reject) => {
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
        const { root } = this;

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
                        resolve();
                    });
                }
                return;
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

        const promiseList = this.getInstalledPlugins().map(async (name: string): Promise<FeflowPlugin> => {
            const pluginPath = path.join(root, 'node_modules', name, 'package.json');
            const content: Buffer = fs.readFileSync(pluginPath);
            const pkg: Package = JSON.parse(content as any);
            const localVersion = pkg.version;
            const registryUrl = await getRegistryUrl(packageManager);
            const latestVersion = await getPackageVersion(name, 'latest', registryUrl, logger);

            let pluginInfo: FeflowPlugin = { name: "", latestVersion: "" };

            if (latestVersion !== localVersion) {
                table.cell('Name', name);
                table.cell('Version', localVersion === latestVersion ? localVersion : localVersion + ' -> ' + latestVersion);
                table.cell('Tag', 'latest');
                table.cell('Update', localVersion === latestVersion ? 'N' : 'Y');
                table.newRow();

                pluginInfo = {
                    name,
                    latestVersion
                };
            } else {
                logger.debug('All plugins is in latest version');
            }

            return pluginInfo
        })

        return Promise.all<FeflowPlugin>(promiseList).then((plugins: FeflowPlugin[]) => {
            plugins = plugins.filter((plugin: FeflowPlugin) => {
                return plugin && plugin.name;
            });
            if (plugins.length) {
                this.logger.info('It will update your local templates or plugins, this will take few minutes');
                console.log(table.toString());

                this.updatePluginsVersion(rootPkg, plugins);

                const needUpdatePlugins: string[] = [];

                plugins.map((plugin: FeflowPlugin) => {
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

    updatePluginsVersion(packagePath: string, plugins: FeflowPlugin[]) {
        const obj: Package = require(packagePath);

        plugins.map((plugin: FeflowPlugin) => {
            obj.dependencies[plugin.name] = plugin.latestVersion;
        });

        fs.writeFileSync(packagePath, JSON.stringify(obj, null, 4));
    }

    getInstalledPlugins(): string[] {
        const { root, rootPkg } = this;

        let plugins: string[] = [];
        const exist = fs.existsSync(rootPkg);
        const pluginDir = path.join(root, 'node_modules');

        if (!exist) {
            plugins = [];
        } else {
            const content: Buffer = fs.readFileSync(rootPkg);

            let json: Package;

            try {
                json = JSON.parse(content as any);
                const deps = json.dependencies || json.devDependencies || {};

                plugins = Object.keys(deps);
            } catch (ex) {
                plugins = [];
            }
        }
        return plugins.filter((name) => {
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

    call(name: string, ctx: Feflow) {
        return new Promise<null>((resolve, reject) => {
            const cmd = this.commander.get(name);
            if (cmd) {
                cmd.call(this, ctx);
                resolve();
            } else {
                reject(new Error('Command `' + name + '` has not been registered yet!'));
            }
        });
    }
}