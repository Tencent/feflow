import path from 'path';
import fs from 'fs';
import chalk from 'chalk';
import { UniversalPkg } from '../universal-pkg/dep/pkg';
import { resolvePlugin } from '../plugin/applyPlugins';

function loadModuleList(ctx: any) {
  const packagePath = ctx.rootPkg;
  const pluginDir = path.join(ctx.root, 'node_modules');
  const extend = function(target: any, source: any) {
    for (const obj in source) {
      target[obj] = source[obj];
    }
    return target;
  };
  if (fs.existsSync(packagePath)) {
    const content = fs.readFileSync(packagePath, 'utf8');
    const json = JSON.parse(content);
    const deps = extend(json.dependencies || {}, json.devDependencies || {});
    const keys = Object.keys(deps);
    const list = keys
      .filter(function(name) {
        if (
          !/^feflow-plugin-|^@[^/]+\/feflow-plugin-|generator-|^@[^/]+\/generator-/.test(
            name
          )
        )
          return false;
        const pluginPath = path.join(pluginDir, name);
        return fs.existsSync(pluginPath);
      })
      .map(key => {
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
    const content = fs.readFileSync(packagePath, 'utf8');
    const json = JSON.parse(content);
    return (json && json.version) || 'unknown';
  } else {
    return 'unknown';
  }
}

function loadUniversalPlugin(ctx: any): any[] {
  const { universalPkg }: { universalPkg: UniversalPkg } = ctx;
  const availablePlugins: any[] = [];

  for (const [pkg, version] of universalPkg.getInstalled()) {
    availablePlugins.push({
      name: pkg,
      version: version
    });
  }

  return availablePlugins;
}

module.exports = (ctx: any) => {
  const { universalModules } = ctx;
  ctx.commander.register('list', 'Show all plugins installed.', () => {
    const list = loadModuleList(ctx);
    const universalPlugins = loadUniversalPlugin(ctx);
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

    const plugins: any[] = [];
    const templates: any[] = [];
    list.forEach(item => {
      if (/generator-|^@[^/]+\/generator-/.test(item.name)) {
        templates.push(item);
      } else {
        plugins.push(item);
      }
    });
    console.log('templates');
    if (templates.length == 0) {
      console.log(chalk.magenta('No templates have been installed'));
    } else {
      templates.forEach(item =>
        console.log(chalk.magenta(`${item.name}(${item.version})`))
      );
    }
    const storePlugins = plugins.filter(item =>
      /^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(item.name)
    );
    const gitPlugins = plugins.filter(
      item => !/^feflow-plugin-|^@[^/]+\/feflow-plugin-/.test(item.name)
    );
    console.log('plugins');
    if (storePlugins.length == 0 && gitPlugins.length == 0) {
      console.log(chalk.magenta('No plugins have been installed'));
    } else {
      storePlugins.forEach(item =>
        console.log(chalk.magenta(`${item.name}(${item.version})`))
      );
    }
    if (gitPlugins.length > 0) {
      console.log('git plugins');
      gitPlugins.forEach(item => {
        const url = `http://${item.name.replace(/:/g, '/')}.git`;
        const repoPath = path.join(
          universalModules,
          `${item.name}@${item.version}`
        );
        let useCommand = item.name;
        const plugin = resolvePlugin(ctx, repoPath);
        if (plugin.name) {
          useCommand = plugin.name;
        }
        console.log(
          chalk.magenta(
            `${url}(command: ${useCommand}, version: ${item.version})`
          )
        );
      });
    }
  });
};
