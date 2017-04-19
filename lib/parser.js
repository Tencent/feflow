'use strict';

/**
 * feflow parser
 *
 * @author lewischeng@tencent.com
 * @date   2017/3/27
 */

const version = '0.4.1';
const argv = require('minimist')(process.argv.slice(2));
const Feflow = require('./feflow');

const feflow = new Feflow(version);


const parseArgs = () => {
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
};


module.exports = parseArgs;