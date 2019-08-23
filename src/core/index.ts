import Commander from './commander';
import fs from 'fs';
import inquirer from 'inquirer';
import logger from './logger';
import osenv from 'osenv';
import path from 'path';
import { spawnSync } from 'child_process';
import loadPlugins from './plugin/loadPlugins';
import loadDevkits from './devkit/loadDevkits';
import { FEFLOW_ROOT } from '../shared/constant';
import { safeDump, parseYaml } from '../shared/yaml';
const pkg = require('../../package.json');

export default class Feflow {
    public args: any;
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
        await this.loadNative();
        await loadPlugins(this);
        await loadDevkits(this)(this);
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
                        const ret = spawnSync(packageName, ['-v'], { stdio: 'ignore' });
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