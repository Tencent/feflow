'use strict';

/**
 * feflow parser
 *
 * @author lewischeng@tencent.com
 * @date   2017/3/27
 */

const version = '0.6.2';
const _ = require('lodash');
const co = require('co');
const shell = require('shelljs');
const argv = require('minimist')(process.argv.slice(2));
const Feflow = require('./feflow');

const feflow = new Feflow(version);


const parseArgs = co(function* () {
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

    // 工程初始化
    if (argv['_'][0] === 'init') {

        // 检测是否是新用户
        if (feflow.isNewUser()){
            // 初始化配置
            feflow.configClient();

            return;
        }

        return feflow.scaffoldProject();
    }

    // 规范扫描
    if (argv['_'][0] === 'scan') {

        const receiver = argv['receiver'];

        if (receiver) {
            yield feflow.scanAll(receiver);
            shell.echo('已经通过邮件的方式发到您指定的邮箱，请查收');
        }
    }

    // 插件安装
    if (argv['_'][0] === 'install') {
        const modules = argv['_'].slice(1);

        console.log(modules)

        yield feflow.install(modules);
    }
});

module.exports = parseArgs;