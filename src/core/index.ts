import Commander from './commander';
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
const pkg = require('../../package.json');

export default class Feflow {
    public args: any;
    public projectConfig: any;
    public version: string;
    public logger: any;
    public commander: any;
    public root: any;
    public rootPkg: any;
    public config: any;

    constructor(args: any) {
        args = args || {};
        const root = path.join(osenv.home(), FEFLOW_ROOT);
        const configPath = path.join(root, '.feflowrc.yml');
        this.root = root;
        this.rootPkg = path.join(root, 'package.json');
        this.args = args;
        this.version = pkg.version;
        this.config = parseYaml(configPath);
        this.commander = new Commander();
        this.logger = logger({
            debug: Boolean(args.debug),
            silent: Boolean(args.silent)
        });
    }

    async init() {
        await this.initClient();
        await this.checkUpdate();
        await this.loadNative();
        await loadPlugins(this);
        await loadDevkits(this);
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
        return Promise.all(this.getInstalledPlugins().map(async (name: any) => {
            const pluginPath = path.join(root, 'node_modules', name, 'package.json');
            const content: any = fs.readFileSync(pluginPath);
            const pkg: any = JSON.parse(content);
            const localVersion = pkg.version;
            const registryUrl = await getRegistryUrl(packageManager);
            const latestVersion = await packageJson(name, 'latest', registryUrl);

            if (latestVersion !== localVersion) {
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

    call(name: any, ctx: any) {
        return new Promise<any>((resolve, reject) => {
            const cmd = this.commander.get(name);
            if (cmd) {
                cmd.call(this, ctx);
            } else {
                reject(new Error('Command `' + name + '` has not been registered yet!'));
            }
        });
    }
}