'use strict';

const inquirer = require('inquirer');
const shell = require('shelljs');
const yeoman = require('yeoman-environment');
const yeomanEnv = yeoman.createEnv();

module.exports = class Feflow {

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

};