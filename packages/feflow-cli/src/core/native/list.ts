
import path from 'path';
import fs from 'fs';
import chalk from 'chalk'
import { UNIVERSAL_PKG_JSON } from "../../shared/constant"

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
  const universalPkgJsonPath = path.join(ctx.root, UNIVERSAL_PKG_JSON);
  let availablePluigns: any[] = [];

  if (fs.existsSync(universalPkgJsonPath)) {
    try {
      const content = fs.readFileSync(universalPkgJsonPath, 'utf8');
      const json = JSON.parse(content);
      const pluginsInConfig = Object.keys(json.dependencies || {});
      const pluginsInCommand = ctx.commander.store;
      // make sure universal plugin is available which listed
      availablePluigns = pluginsInConfig.filter(plugin => {
        const pluginCommand = (universalPluginRegex.exec(plugin) || [])[1];
        return pluginsInCommand[pluginCommand];
      });
    } catch (error) {
      ctx.logger.error('universal plugin config parse error. ', error);
    }
  } else {
    ctx.logger.debug(`there is no ${UNIVERSAL_PKG_JSON} in ~/.fef`);
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

