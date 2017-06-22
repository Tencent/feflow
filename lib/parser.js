'use strict';

/**
 * feflow parser
 *
 * @author lewischeng@tencent.com
 * @date   2017/3/27
 */

const version = '0.7.3';
const _ = require('lodash');
const co = require('co');
const shell = require('shelljs');
const argv = require('minimist')(process.argv.slice(2));
const Feflow = require('./feflow');

const feflow = new Feflow(version);


const parseArgs = () => {
    co(function* () {
        const keys = Object.keys(argv);

        // 如果没有任何参数，打印feflow 的 Banner
        if (keys.length === 1 && !argv['_'][0]) {
            return feflow.printBanner();
        }

        // 版本显示
        if (argv['v'] || argv['V'] || argv['version']) {
            return feflow.printVersion();
        }

        if (argv['help']) {
            return feflow.printUsage();
        }

        // 对于其它功能性的命令，运行前自动检查当前的felfow版本
        yield feflow.checkUpgrade();

        // 运行其它命令需要检测是否完成初始化
        if (argv['_'][0] && feflow.isNewUser()) {
            // 初始化配置
            feflow.configClient(parseArgs);

            return;
        }

        switch (argv['_'][0]) {
            case 'configure':
                const global = argv['global'];

                if (global) {
                    feflow.configGlobal();
                }
                break;
            case 'init':
                // 工程初始化
                yield feflow.scaffoldProject();
                break;
            case 'scan':
                // 规范扫描
                const receiver = argv['receiver'];

                const autoRepair = argv['autoRepair'] || false;

                const top = argv['top'] || 10;

                if (receiver) {
                    yield feflow.scanAll(receiver, autoRepair, top);
                    shell.echo('已经通过邮件的方式发到您指定的邮箱，请查收');
                }
                break;
            case 'install':
                // 插件安装
                const modules = argv['_'].slice(1);

                yield feflow.install(modules);
                break;
            default:
                // 检查本地是否有安装插件，并且执行插件提供的命令
                yield feflow.execPlugin(argv['_'][0], argv);
        }

    });
};

module.exports = parseArgs;
