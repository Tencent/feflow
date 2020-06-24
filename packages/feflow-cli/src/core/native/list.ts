import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
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
      if (
        !/^feflow-plugin-|^@[^/]+\/feflow-plugin-|generator-|^@[^/]+\/generator-/.test(
          name
        )
      )
        return false;
      const pluginPath = path.join(pluginDir, name);
      return fs.existsSync(pluginPath);
    }).map(key => {
      return {
        name: key,
        version: getModuleVersion(pluginDir, key)
      };
    });
    return list;
  } else {
    return [];
  }
}

function getModuleVersion(dir: string, name: string): string {
  const packagePath = path.resolve(dir, name, 'package.json');
  if (fs.existsSync(packagePath)) {
    let content = fs.readFileSync(packagePath, 'utf8');
    const json = JSON.parse(content);
    return json && json.version || 'unknown';
  } else {
    return 'unknown';
  }
}

const universalPluginRegex = new RegExp('^feflow-(?:devkit|plugin)-(.*)', 'i');

function loadUniversalPlugin(ctx: any): any[] {
  const { universalPkg }: { universalPkg: UniversalPkg } = ctx;
  let availablePluigns: any[] = [];

  const pluginsInCommand = ctx.commander.store;
  for (const [pkg, version] of universalPkg.getInstalled()) {
    const pluginCommand = (universalPluginRegex.exec(pkg) || [])[1];
    if (pluginsInCommand[pluginCommand]) {
      availablePluigns.push({
        name: pkg,
        version: version
      });
    }
  }

  return availablePluigns;
}

module.exports = (ctx: any) => {
  ctx.commander.register('list', 'Show all plugins installed.', () => {
    const list = loadModuleList(ctx);
    const universalPlugins = loadUniversalPlugin(ctx);
    let templateCnt = 0;
    let pluginCnt = 0;
    list.push(...universalPlugins);

    console.log(
      'You can search more templates or plugins through https://feflowjs.com/encology/'
    );
    if (!list.length) {
      console.log(
        chalk.magenta('No templates and plugins have been installed')
      );
      return;
    }

    console.log('templates');
    list.map(function (item) {
      if (/generator-|^@[^/]+\/generator-/.test(item.name)) {
        console.log(chalk.magenta(`${item.name}(${item.version})`));
        templateCnt = 1;
      }
    });
    if (!templateCnt) {
      console.log(chalk.magenta('No templates have been installed'));
    }

    console.log('plugins');
    list.map(function (item) {
      if (/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(item.name)) {
        console.log(chalk.magenta(`${item.name}(${item.version})`));
        pluginCnt = 1;
      }
    });
    if (!pluginCnt) {
      console.log(chalk.magenta('No plugins have been installed'));
    }
  });
};
