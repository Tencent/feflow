
import path from 'path';
import fs from 'fs';
import chalk from 'chalk'
import { UniversalPkg } from '../universal-pkg/dep/pkg';

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

const universalPluginRegex = new RegExp('^feflow-(?:devkit|plugin)-(.*)', 'i');

function loadUniversalPlugin(ctx: any): any[] {
  const { universalPkg }
  : { universalPkg: UniversalPkg } = ctx;
  let availablePluigns: any[] = [];

  const pluginsInCommand = ctx.commander.store;
  for (const [pkg] of universalPkg.getInstalled()) {
    const pluginCommand = (universalPluginRegex.exec(pkg) || [])[1];
    if (pluginsInCommand[pluginCommand]) {
      availablePluigns.push(pluginCommand);
    }
  }

  return availablePluigns;
}

module.exports = (ctx: any) => {
    ctx.commander.register('list', 'Show all plugins installed.', () => {
        const list = loadModuleList(ctx);
        const universalPlugins = loadUniversalPlugin(ctx);
        let templateCnt  = 0;
        let pluginCnt = 0;
        list.push(...universalPlugins);

        console.log('You can search more templates or plugins through https://feflowjs.com/encology/');
        console.log('===============================================');
        if (!list.length) {
            console.log(chalk.magenta('No templates and plugins have been installed'));
            return;
        }

        console.log('templates');
        list.map(function (name) {
            if (/generator-|^@[^/]+\/generator-/.test(name)) {
                console.log(chalk.magenta(name));
                templateCnt = 1;
            }
        });
        if (!templateCnt) {
            console.log(chalk.magenta('No templates have been installed'));
        }

        console.log('plugins');
        list.map(function (name) {
            if (/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(name)) {
                console.log(chalk.magenta(name));
                pluginCnt = 1;
            }
        });
        if (!pluginCnt) {
            console.log(chalk.magenta('No plugins have been installed'));
        }
    });
};

