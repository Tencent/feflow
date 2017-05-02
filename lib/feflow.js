'use strict';

const _ = require('lodash');
const osenv = require('osenv');
const path = require('path');
const fs = require('fs');
const co = require('co');
const inquirer = require('inquirer');
const shell = require('shelljs');
const chalk = require('chalk');
const meow = require('meow');
const rp = require('request-promise');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();
const scanner = require('@tencent/feflow-scanner');
const plugin = require('@tencent/feflow-plugin');

const homeDir = osenv.home();

class Feflow {

    constructor(version) {
        this.version = version;
    }

    /**
     * 打印版本号
     * @private
     */
    printVersion() {
        shell.echo(`当前使用的feflow版本为${this.version}`);
    }

    /**
     * 打印帮助信息
     * @private
     */
    printUsage() {
        const cli = meow(`
            Usage: feflow [options] [command]
            
            Commands:
                init,                       Choose a scaffold to initialize project.
                scan     --receiver         Scan a group and mail to receiver.
                install  <plugin>           Install a plugin or a yeoman generator. 
                
            Options:
                --version, -[vV]            Print version and exit successfully.
                --help,                     Print this help and exit successfully.
                
            Report bugs to http://git.code.oa.com/feflow/discussion/issues.    
        `);

        return cli.showHelp(1);
    }

    /**
     * 打印banner
     * @private
     */
    printBanner() {
        shell.echo( '  ______    ______    ______    _        _____     _   __     _    _                                  ');
        shell.echo( ' |  ____|  |  ____|  |  ____|  | |      / ___ \\   \\ \\  \\ \\   / /  / /                            ');
        shell.echo( ' | |____   | |____   | |____   | |     | |   | |   \\ \\  \\ \\ / /  / /                              ');
        shell.echo( ' |  ____|  |  ____|  |  ____|  | |     | |   | |    \\ \\  \\ \\ /  / /                               ');
        shell.echo( ' | |       | |____   | |       | |___  \\ \\___/ /     \\ \\_/\\ /\\_/ /                              ');
        shell.echo( ' |_|       |______|  |_|       |_____|  \\_____/       \\___/\\_\\__/                                 ');
        shell.echo( '                                                                                                      ');
        shell.echo( ` Feflow，当前版本${this.version}, 让开发工作流程更简单，主页：http://git.code.oa.com/feflow/feflow-cli     `);
        shell.echo( ' (c) powered by IVWEB Team                                                                            ');
        shell.echo( ' Run feflow --help to see usage.                                                                      ');
    }

    /**
     * 查询最新的版本
     */
    _getLatestVersion() {
        const REGISTRY_URL = 'http://r.tnpm.oa.com/@tencent/feflow-cli/latest';

        return new Promise(function (resolve, reject) {

            const options = {
                url: REGISTRY_URL,
                method: 'GET'
            };

            rp(options)
                .then((response) => {
                    // 查询成功
                    response = JSON.parse(response);
                    const version = response && response.version;
                    resolve({
                        success: true,
                        data: version
                    })
                })
                .catch((err) => {
                    // 查询失败
                    resolve({
                        success: false,
                        msg: err && err.error
                    });
                });
        });
    }

    /**
     * 检查是否需要提示开发者升级信息
     */
    *checkUpgrade() {
        const self = this;
        const versionData = yield self._getLatestVersion();

        if (versionData.success) {
            const latestVersion = versionData.data;
            const currentVersion = self.version;
            if (latestVersion !== currentVersion) {
                shell.echo('目前最新版本的 @tencent/feflow-cli 为：' + chalk.green(latestVersion) + ', 你的当前版本为：' + chalk.red(currentVersion));
                shell.echo('升级命令：' + chalk.green('`$ tnpm install -g @tencent/feflow-cli`'));
            }
        }
    }

    /*
     * 检测是否是新用户
     */
    isNewUser() {
        const feflowRoot = path.join(homeDir, './.feflow');

        const configFile = path.join(feflowRoot, '/config.json');

        if (!fs.existsSync(feflowRoot) || !fs.existsSync(configFile)) {
            return true;
        }
        return false;
    }

    /**
     * 写入package.json 配置文件
     */
    writePkgJson() {
        const homeDir = osenv.home();

        const feflowRoot = path.join(homeDir, './.feflow');

        const pkgJson = path.join(feflowRoot, '/package.json');

        fs.writeFileSync(pkgJson, JSON.stringify({"name": "feflow-home", "version": "0.0.0", private: true}));
    }

    /**
     * 写入generator安装配置信息
     */
    writeGeneratorCfg(installedModules) {
        const feflowRoot = path.join(homeDir, './.feflow');

        const configFile = path.join(feflowRoot, '/config.json');

        if (fs.existsSync(configFile)) {
            const fileContent = fs.readFileSync(configFile, 'utf-8');

            const userConfig = JSON.parse(fileContent);

            // 如果已经存在generator配置，则追加
            if (Array.isArray(userConfig.generator)) {
                userConfig.generator = userConfig.generator.concat(installedModules);
            } else {
                userConfig.generator = installedModules;
            }

            fs.writeFileSync(configFile, JSON.stringify(userConfig), 'utf-8');
        }
    }

    /**
     * 读取安装的Generarot信息
     * @returns {*|Array|string|Array.<T>}
     */
    readGeneratorCfg() {
        const feflowRoot = path.join(homeDir, './.feflow');

        const configFile = path.join(feflowRoot, '/config.json');

        if (fs.existsSync(configFile)) {
            const fileContent = fs.readFileSync(configFile, 'utf-8');

            const userConfig = JSON.parse(fileContent);

            // 如果已经存在generator配置，则追加
            if (Array.isArray(userConfig.generator)) {
                return userConfig.generator;
            }
        }
    }


    /**
     * 运行generator
     * @param generatorName
     */
    runGenerator(generatorName) {
        const feflowRoot = path.join(homeDir, './.feflow');

        const generatorRoot = path.join(feflowRoot, './node_modules');

        const generatorPath = path.join(generatorRoot, generatorName, 'generators/app/index.js');

        yeomanEnv.register(require.resolve(generatorPath), generatorName);

        yeomanEnv.run(generatorName, { 'skip-install': true }, err => {
            console.log('done');
        });
    }

    /**
     * 配置开发者客户端
     *
     * 如果是用户第一次使用feflow，则进行初始化。在HOME路径下创建.feflow文件夹
     * 同时，需要用户填写Git帐号和密码
     */
    configClient() {
        const self = this;

        const feflowRoot = path.join(homeDir, './.feflow');

        const configFile = path.join(feflowRoot, '/config.json');

        const pkgJson = path.join(feflowRoot, '/package.json');

        /**
         * 初始化时要求填写用户基本资料信息.
         * @private
         */
        const _initialize = () => {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'username',
                    message: '请输入Git code用户名 (目前Git不支持绑定私钥):'
                }, {
                    type: 'password',
                    name: 'password',
                    message: '请输入Git code密码:'
                }, {
                    type: 'password',
                    name: 'confirmPassword',
                    message: '请再次输入确认Git code密码:'
                }
            ]).then(function (answers) {
                const {username, password, confirmPassword} = answers;

                if (password !== confirmPassword) {
                    shell.echo('两次密码输入有误，feflow将会重新初始化');

                    _initialize();
                } else {
                    fs.writeFileSync(configFile, JSON.stringify({username: username, password: password}));

                    self.writePkgJson();

                    shell.echo('恭喜，初始化配置完成，即将自动运行feflow init命令！');

                    return self.configClient();
                }
            });
        };

        // 检查是否存在.feflow目录
        if (!fs.existsSync(feflowRoot)) {

            shell.echo('这是您第一次使用feflow，需要您填写一些初始化信息。');

            fs.mkdirSync(feflowRoot);
        }

        // 检查用户是否完成初始化
        if (!fs.existsSync(configFile)) {

            shell.echo('feflow检测到您尚未完成初始化，将继续初始化过程');

            _initialize();
        }

        // 检查是否有package.json文件
        if (!fs.existsSync(pkgJson)) {
            self.writePkgJson();
        }
    }


    /**
     * 工程脚手架初始化
     */
    scaffoldProject() {
        const self = this;

        const generators = this.readGeneratorCfg();

        // 询问用户需要创建哪种类型的项目
        const choices = [];

        _.map(generators, (generator) => {
            choices.push(generator.description);
        });

        inquirer.prompt([
            {
                type: 'list',
                name: 'projectType',
                message: '您想要创建哪中类型的工程?',
                choices: choices
            }
        ]).then(function (answers) {

            let generatorName;

            const projectType = answers.projectType;

            _.map(generators, (generator) => {
                if (generator.description === projectType) {
                    generatorName = generator.module;
                }
            });

            if (generatorName) {
                self.runGenerator(generatorName);
            }
        });
    }


    /**
     * 扫描规范命令集成，暂时不提供订阅，只能扫描所有的
     */
    *scanAll(receiver) {
        yield [
            scanner.scanAvWeb(receiver),
            scanner.scanIvWeb(receiver),
            scanner.scanNowActivity(receiver)
        ];
    }

    /**
     * 插件安装命令
     */
    *install(modules) {
        const results = yield plugin.install(modules);

        if (Array.isArray(results)) {
            const installedModules = [];
            _.map(results, (item) => {
                installedModules.push({
                    module: item.module,
                    version: item.latestVersion,
                    description: item.description
                });
            });


            this.writeGeneratorCfg(installedModules);
        }
    }

}

module.exports = Feflow;