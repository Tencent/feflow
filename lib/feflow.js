'use strict';

const _ = require('lodash');
const osenv = require('osenv');
const path = require('path');
const fs = require('fs');
const co = require('co');
const opn = require('opn');
const inquirer = require('inquirer');
const shell = require('shelljs');
const chalk = require('chalk');
const meow = require('meow');
const figlet = require('figlet');
const tough = require('tough-cookie');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();
const configure = require('@tencent/feflow-configure');
const scanner = require('@tencent/feflow-scanner');
const plugin = require('@tencent/feflow-plugin');
const publish = require('@tencent/feflow-publish');
const utils = require('@tencent/feflow-utils');
const homeDir = osenv.home();
const log = utils.log;
const rp = utils.rp;

const pkg = require('../package.json');
const feflowRoot = path.join(homeDir, './.feflow');

class Feflow {

    /**
     * 打印版本号
     * @private
     */
    printVersion() {
        shell.echo(`当前使用的feflow版本为${pkg.version}`);
    }

    /**
     * 打印帮助信息
     * @private
     */
    printUsage() {
        const cli = meow(`
            Usage: feflow [options] [command]
            
            Commands:
                configure --global        Config cli client.
                init                      Choose a scaffold to initialize project.
                scan     --receiver       Scan a group and mail to receiver.
                install  <plugin>         Install a plugin or a yeoman generator. 
                publish                   Publish files to cdn or offline package.
               
                
            Options:
                --version, -[vV]          Print version and exit successfully.
                --help, -[hH]             Print this help and exit successfully.
                
            Report bugs to http://git.code.oa.com/feflow/discussion/issues.    
        `);

        return cli.showHelp(1);
    }

    /**
     * 打印banner
     * 字体预览地址：http://patorjk.com/software/taag/#p=display&f=3D-ASCII&t=feflow%0A
     *
     * @private
     */
    printBanner() {
        figlet.text('feflow', {
            font: '3D-ASCII',
            horizontalLayout: 'default',
            verticalLayout: 'default'
        }, function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }

            console.log(chalk.cyan(data));
            console.log(chalk.cyan(` Feflow，当前版本${pkg.version}, 让开发工作流程更简单，官网: http://feflow.oa.com/                        `));
            console.log(chalk.cyan(' (c) powered by IVWEB Team                                                                            '));
            console.log(chalk.cyan(' Run feflow --help to see usage.                                                                      '));
        });
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
            const currentVersion = pkg.version;

            if (latestVersion !== currentVersion) {
                shell.echo('目前最新版本的 @tencent/feflow-cli 为：' + chalk.green(latestVersion) + ', 你的当前版本为：' + chalk.red(pkg.version));
                shell.echo('升级命令：' + chalk.green('`$ tnpm install -g @tencent/feflow-cli`'));
            }
        }
    }

    /*
       使用某个插件或者脚手架时进行增量更新功能
     */
    *incrementUpgrade(moduleName, callback) {
        const checkResult = yield plugin._checkUpgrade([moduleName]);

        const needUpgrade = checkResult.needUpgrade;

        if (needUpgrade.length > 0) {
            const confirmAnswer = yield inquirer.prompt([{
                type: 'confirm',
                name: 'upgrade',
                message: `您当前的${moduleName}不是最新版本，是否更新？`,
                default: true
            }]);

            if (confirmAnswer && confirmAnswer.upgrade) {
                const installResult = yield plugin.install(moduleName);

                if (installResult) {
                    log.info(`${moduleName}更新成功，即将进行下一步操作...`);
                    callback(moduleName);
                } else {
                    log.error(`${moduleName}更新失败，请重试`);
                }
            } else {
                log.info(`您取消了${moduleName}的更新`);
                callback(moduleName);
            }
        } else {
            callback(moduleName);
        }
    }

    /*
     * 检测是否是新用户
     */
    isNewUser() {
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
        const pkgJson = path.join(feflowRoot, '/package.json');

        fs.writeFileSync(pkgJson, JSON.stringify({"name": "feflow-home", "version": "0.0.0", private: true}));
    }

    /**
     * 写入generator安装配置信息
     */
    writeGeneratorCfg(installedModules) {
        const configFile = path.join(feflowRoot, '/config.json');

        if (fs.existsSync(configFile)) {
            const fileContent = fs.readFileSync(configFile, 'utf-8');

            const userConfig = JSON.parse(fileContent);

            let generators = userConfig.generator;

            // 如果已经存在generator配置，则追加
            if (Array.isArray(generators)) {

                for (let i = 0; i < installedModules.length; i ++) {

                    let isExist = false;

                    for (let j = 0; j < generators.length; j ++) {

                        if (installedModules[i].module === generators[j].module) {
                            isExist = true;

                            generators[j].version = installedModules[i].version;
                            generators[j].description = installedModules[i].description;
                        }
                    }

                    if (!isExist) {
                        generators.push(installedModules[i]);
                    }
                }
            } else {
                generators = installedModules;
            }

            userConfig.generator = generators;

            fs.writeFileSync(configFile, JSON.stringify(userConfig), 'utf-8');
        }
    }

    /**
     * 读取安装的Generarot信息
     * @returns {*|Array|string|Array.<T>}
     */
    readGeneratorCfg() {
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
        const generatorRoot = path.join(feflowRoot, './node_modules');

        const generatorPath = path.join(generatorRoot, generatorName, 'generators/app/index.js');

        yeomanEnv.register(require.resolve(generatorPath), generatorName);

        yeomanEnv.run(generatorName, { 'skip-install': true }, err => {});
    }


    /**
     * 配置开发者客户端
     *
     * 如果是用户第一次使用feflow，则进行初始化。在HOME路径下创建.feflow文件夹
     * 同时，需要用户填写Git帐号和密码
     */
    configClient(parseArgs) {
        const self = this;

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
                    message: '请输入RTX用户名'
                }
            ]).then(function (answers) {
                const {username} = answers;

                fs.writeFileSync(configFile, JSON.stringify({username: username}));

                self.writePkgJson();

                log.info('恭喜，初始化配置完成！');

                return parseArgs();

            });
        };

        // 检查是否存在.feflow目录
        if (!fs.existsSync(feflowRoot)) {

            log.info('这是您第一次使用feflow，需要您填写一些初始化信息。');

            fs.mkdirSync(feflowRoot);
        }

        let isInitialed;
        // 检查用户是否完成初始化
        if (!fs.existsSync(configFile)) {
            isInitialed = false;
        } else {
            const fileContent = fs.readFileSync(configFile, 'utf-8');

            try {
                const userConfig = JSON.parse(fileContent);
                if (!userConfig.username) {
                    isInitialed = false;
                }
            } catch (e) {

                isInitialed = false;
            }
        }

        if (!isInitialed) {
            log.warn('feflow检测到您尚未完成初始化，将继续初始化过程');

            _initialize();
        }

        // 检查是否有package.json文件
        if (!fs.existsSync(pkgJson)) {
            self.writePkgJson();
        }
    }

    /**
     * 获取预安装的官方插件列表
     */
    getPreInstallPlugins() {
        const PRE_INSTALL_URL = 'http://api.feflow.oa.com/v1/plugin?plugin_type=1';

        return new Promise(function (resolve, reject) {

            const options = {
                url: PRE_INSTALL_URL,
                method: 'GET'
            };

            rp(options)
                .then((response) => {
                    // 查询成功
                    response = JSON.parse(response);

                    const defaultPlugins = [];
                    Array.isArray(response) && _.map(response, (item) =>　{
                        defaultPlugins.push(item.pluginName);
                    });
                    resolve({
                        success: true,
                        data: defaultPlugins
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

    filterInstalledPlugins(plugins) {
        const nodeModulesRoot = path.join(feflowRoot, './node_modules');

        const filteredPlugins = [];

        _.map(plugins, (item) => {
            const pluginPath = path.join(nodeModulesRoot, item);
            if (!fs.existsSync(pluginPath)) {
                filteredPlugins.push(item);
            }
        });

        return filteredPlugins;
    }

    /**
     * 自动安装官方推荐的插件
     */
    *installDefaultPlugins() {
        const preInstallPluginsResults = yield this.getPreInstallPlugins();

        if (preInstallPluginsResults.success) {
            const preInstallPlugins = preInstallPluginsResults.data;
            const filteredPlugins = this.filterInstalledPlugins(preInstallPlugins);

            if (filteredPlugins.length) {
                log.info('检测到您本地还有feflow官方插件未安装');
                log.info('正在预安装feflow官方插件');
                const result = yield plugin.install(filteredPlugins);
                const needUpgrade = result.needUpgrade;
                if (result.success) {
                    const installedModules = [];
                    _.map(needUpgrade, (item) => {
                        if (/^generator-/.test(item.module) || /^@tencent\/generator-/.test(item.module)) {
                            installedModules.push({
                                module: item.module,
                                version: item.latestVersion,
                                description: item.description
                            });
                        }
                    });
                    this.writeGeneratorCfg(installedModules);

                    log.info('feflow官方插件预安装过程结束');
                } else {
                    log.error('feflow官方插件预安装失败，错误信息：' + result.msg);
                }
            }
        } else {
            log.error(preInstallPluginsResults.msg);
        }
    }

    /**
     * 全局依赖配置安装
     */
    configGlobal() {
        return configure.configGlobal();
    }


    /**
     * 工程脚手架初始化
     */
    *scaffoldProject() {
        const self = this;

        const generators = this.readGeneratorCfg();

        // 询问用户需要创建哪种类型的项目
        const choices = [];

        _.map(generators, (generator) => {
            choices.push(generator.description);
        });

        if (choices.length) {
            const answers = yield inquirer.prompt([{
                type: 'list',
                name: 'projectType',
                message: '您想要创建哪中类型的工程?',
                choices: choices
            }]);

            if (answers) {
                let generatorName;

                const projectType = answers.projectType;

                _.map(generators, (generator) => {
                    if (generator.description === projectType) {
                        generatorName = generator.module;
                    }
                });

                if (generatorName) {
                    yield self.incrementUpgrade(generatorName, self.runGenerator.bind(self));
                }
            }

        } else {
            log.warn('检测到你还未安装任何脚手架，请先安装后再进行项目初始化，参考文档：http://feflow.oa.com/docs/index.html');
        }
    }


    /**
     * 扫描规范命令集成，暂时不提供订阅，只能扫描所有的
     */
    *scanAll(receiver, autoRepair, top) {
        yield [
            scanner.scanAvWeb(receiver, autoRepair, top),
            scanner.scanIvWeb(receiver, autoRepair, top),
            scanner.scanNowActivity(receiver, autoRepair, top)
        ];
    }

    /**
     * 插件安装命令
     */
    *install(modules) {
        const result = yield plugin.install(modules);

        const needUpgrade = result.needUpgrade;

        // 对于generator类型的插件，需要写入本地配置文件，便于初始化
        if (result.success && Array.isArray(needUpgrade)) {
            const installedModules = [];
            _.map(needUpgrade, (item) => {

                if (/^generator-/.test(item.module) || /^@tencent\/generator-/.test(item.module)) {
                    installedModules.push({
                        module: item.module,
                        version: item.latestVersion,
                        description: item.description
                    });
                }
            });


            this.writeGeneratorCfg(installedModules);
        }
    }

    /**
     * 运行插件命令
     */
    *execPlugin(pluginName, args) {
        const pluginRoot = path.join(feflowRoot, './node_modules');

        const pluginPath = path.join(pluginRoot, '@tencent/feflow-plugin-' + pluginName, 'lib/index.js');

        if (!fs.existsSync(pluginPath)) {
            this.printUsage();

            return;
        }

        const pluginModule = require(pluginPath);

        yield this.incrementUpgrade('@tencent/feflow-plugin-' + pluginName, () => {
            pluginModule.run(args);
        });
    }

    *publish() {
        yield publish.init();
    }

}

module.exports = Feflow;