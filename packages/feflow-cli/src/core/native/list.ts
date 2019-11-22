
import path from 'path';
import fs from 'fs';
import chalk from 'chalk'

function loadModuleList(ctx: any) {
    const packagePath = ctx.rootPkg;
    const pluginDir = path.join(ctx.root, 'node_modules');
    const extend = function (target: any, source: any) {
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
            const pluginPath = path.join(pluginDir, name);
            return fs.existsSync(pluginPath);
        });
        return list;
    } else {
        return [];
    }
}


module.exports = (ctx: any) => {
    ctx.commander.register('list', 'Show all plugins installed.', () => {
        const list = loadModuleList(ctx);
        let flag = 0;

        console.log('You can search more templates or plugins through https://feflowjs.com/encology/');
        console.log('===============================================');
        if (!list.length) {
            console.log(chalk.magenta('暂未安装任何模板和插件'));
            return;
        }

        // print templates list
        console.log('templates');
        list.map(function (name) {
            if (/generator-|^@[^/]+\/generator-/.test(name)) {
                console.log(chalk.magenta(name));
                flag = 1;
            }
        });
        if (!flag) {
            console.log(chalk.magenta('暂未安装任何模板'));
        }

        flag = 0;
        // print plugins list
        console.log('plugins');
        list.map(function (name) {
            if (/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
                console.log(chalk.magenta(name));
                flag = 1;
            }
        });
        if (!flag) {
            console.log(chalk.magenta('暂未安装任何插件'));
        }
    });
};

