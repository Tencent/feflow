'use strict';

const osenv = require('osenv');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const shell = require('shelljs');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();

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
        shell.echo('Usage: feflow [options] [command]                                             ');
        shell.echo('                                                                              ');
        shell.echo('Commands:                                                                     ');
        shell.echo('    init,            Choose a scaffold to initialize project.                 ');
        shell.echo('                                                                              ');
        shell.echo('Options:                                                                      ');
        shell.echo('    --version, -[vV] Print version and exit successfully.                     ');
        shell.echo('    --help,          Print this help and exit successfully.                   ');
        shell.echo('                                                                              ');
        shell.echo('Report bugs to http://git.code.oa.com/feflow/discussion/issues.               ');
    }

    /**
     * 打印banner
     * @private
     */
    printBanner() {
        shell.echo( '  ______    ______    ______    _        _____     _   __     _    _         ');
        shell.echo( ' |  ____|  |  ____|  |  ____|  | |      / ___ \\   \\ \\  \\ \\   / /  / /   ');
        shell.echo( ' | |____   | |____   | |____   | |     | |   | |   \\ \\  \\ \\ / /  / /     ');
        shell.echo( ' |  ____|  |  ____|  |  ____|  | |     | |   | |    \\ \\  \\ \\ /  / /      ');
        shell.echo( ' | |       | |____   | |       | |___  \\ \\___/ /     \\ \\_/\\ /\\_/ /     ');
        shell.echo( ' |_|       |______|  |_|       |_____|  \\_____/       \\___/\\_\\__/        ');
        shell.echo( '                                                                             ');
        shell.echo( ' Feflow，让开发工作流程更简单，主页：http://git.code.oa.com/feflow/feflow-cli    ');
        shell.echo( ' (c) powered by IVWEB Team                                                   ');
        shell.echo( '                                                                             ');
    }

    /*
     * 检测是否是新用户
     */
    isNewUser() {
        // 用户的home目录
        const homeDir = osenv.home();

        const feflowRoot = path.join(homeDir, './.feflow');

        const configFile = path.join(feflowRoot, '/config.json');

        if (!fs.existsSync(feflowRoot) || !fs.existsSync(configFile)) {
            return true;
        }
        return false;
    }

    /**
     * 配置开发者客户端
     *
     * 如果是用户第一次使用feflow，则进行初始化。在HOME路径下创建.feflow文件夹
     * 同时，需要用户填写Git帐号和密码
     */
    configClient() {
        const homeDir = osenv.home();

        const feflowRoot = path.join(homeDir, './.feflow');

        const configFile = path.join(feflowRoot, '/config.json');

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

                    shell.echo('恭喜，初始化配置完成，即将自动运行feflow init命令！');
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
    }


    /**
     * 工程脚手架初始化
     */
    scaffoldProject() {
        // 询问用户需要创建哪种类型的项目
        const projectChoice = {
            business: '初始化一个业务项目',
            activity: '初始化一个活动项目'
        };

        inquirer.prompt([
            {
                type: 'list',
                name: 'projectType',
                message: '您想要创建哪中类型的工程?',
                choices: [
                    projectChoice.business,
                    projectChoice.activity
                ]
            }
        ]).then(function (answers) {

            let generatorName;

            if (answers.projectType === projectChoice.business) {
                generatorName = '@tencent/now-business'
            } else if (answers.projectType === projectChoice.activity) {
                generatorName = '@tencent/now-activity'
            }

            // Lookup方法会在本地查找已经安装过的generator
            yeomanEnv.lookup(() => {
                yeomanEnv.run(generatorName, {'skip-install': true}, err => {
                    console.log('done');
                });
            });
        });
    }

}

module.exports = Feflow;