/*
 * @Description: display all plugins installed
 * @Author: salomezhang
 * @Date: 2019-04-15
 */

const pathFn = require('path');
const fs = require('fs');
const chalk = require('chalk');

function loadModuleList(ctx) {
    const packagePath = pathFn.join(ctx.baseDir, 'package.json');
    const pluginDir = ctx.pluginDir;
    const extend = function (target, source) {
        for (var obj in source) {
            target[obj] = source[obj];
        }
        return target;
    };
    if (fs.existsSync(packagePath)) {
        let content = fs.readFileSync(packagePath, 'utf8');
        const json = JSON.parse(content);
        const deps = extend(json.dependencies || {}, json.devDependencies || {});
        let keys = Object.keys(deps);
        let list = keys.filter(function (name) {
            if (!/^feflow-plugin-|^@[^/]+\/feflow-plugin-|generator-|^@[^/]+\/generator-/.test(name)) return false;
            const path = pathFn.join(pluginDir, name);
            return fs.existsSync(path);
        });
        return list;
    } else {
        return [];
    }
}

module.exports = function () {
    const ctx = this;
    const list = loadModuleList(ctx);

    console.log('Below are all installed generators and plugins:');
    console.log('===============================================');
    list.map(function (name) {
        console.log(chalk.magenta(name));
    })
};
